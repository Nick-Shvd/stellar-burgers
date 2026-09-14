import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { orderSlice, getOrdersLogin } from '../../services/order-slice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();
  useEffect(() => { dispatch(getOrdersLogin()); }, []);

  const orders: TOrder[] = useSelector(orderSlice.selectors.selectUserOrders);
  const isLoading = useSelector(orderSlice.selectors.selectUserOrdersRequest);

if (isLoading && orders.length === 0) {
  return <Preloader />;
}
  return <ProfileOrdersUI orders={orders} />;
};
