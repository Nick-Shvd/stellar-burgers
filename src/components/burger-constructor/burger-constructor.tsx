import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';
import { postOrderApi, orderSlice } from '../../services/order-slice';
import { burgerConstrucorSlice } from '../../services/burger-constructor-slice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  
  const navigate = useNavigate();
  const user = useSelector( (state) => state.userData.user);
  const  constructorItems  = useSelector( (state) => state.addedIngredients);

  const orderRequest = useSelector( (state) => state.orderData.orderRequest);

 const orderModalData = useSelector( (state) => state.orderData.orderModalData)

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (user === null) {
      navigate('/login')
      return;
    }

    const arrOfingredientsOrder = [constructorItems.bun._id, ...constructorItems.ingredients.map((item)=> item._id ), constructorItems.bun._id]

    dispatch(postOrderApi(arrOfingredientsOrder))
    
  };

  const closeOrderModal = () => {

    dispatch(orderSlice.actions.clearOrderData())
    dispatch(burgerConstrucorSlice.actions.resetConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
