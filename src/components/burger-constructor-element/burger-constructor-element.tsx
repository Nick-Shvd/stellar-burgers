import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import { burgerConstrucorSlice } from '../../services/burger-constructor-slice';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => {dispatch(burgerConstrucorSlice.actions.productDoww(index))};

    const handleMoveUp = () => {dispatch(burgerConstrucorSlice.actions.productUp(index))};

    const handleClose = () => {dispatch(burgerConstrucorSlice.actions.removeProduct(ingredient.id))};

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
