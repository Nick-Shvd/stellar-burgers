import { FC, useMemo, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { ingredientsSlice } from '../../services/slice-ingredients';
import { orderSlice, getOrderByNumber } from '../../services/order-slice';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const dispatch = useDispatch();
  const { number } = useParams();
  const orderNumber = Number(number);

  const feedsOrders = useSelector(orderSlice.selectors.selectFeeds);
  const userOrders = useSelector(orderSlice.selectors.selectUserOrders);
  const currentOrder = useSelector(orderSlice.selectors.selectCurrentOrder);
  const currentOrderRequest = useSelector(
    orderSlice.selectors.selectCurrentOrderRequest
  );
  const ingredients = useSelector(
    ingredientsSlice.selectors.selectDataIngredients
  );

  const order = useMemo(
    () =>
      feedsOrders.find((o) => o.number === orderNumber) ||
      userOrders.find((o) => o.number === orderNumber) ||
      currentOrder,
    [feedsOrders, userOrders, currentOrder, orderNumber]
  );

  useEffect(() => {
    if (!order && !currentOrderRequest && orderNumber) {
      dispatch(getOrderByNumber(orderNumber));
    }
  }, [order, currentOrderRequest, orderNumber, dispatch]);

  const orderInfo = useMemo(() => {
    if (!order || !ingredients.length) return null;

    const date = new Date(order.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      date,
      total
    };
  }, [order, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
