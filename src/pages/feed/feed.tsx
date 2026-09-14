import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeedsFromApi, orderSlice } from '../../services/order-slice';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch();

  useEffect( ()=> {
    dispatch(getFeedsFromApi());
  }, [])//первоначальная загрузка (1 раз)

  const orders: TOrder[] = useSelector(orderSlice.selectors.selectFeeds);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={ () => {dispatch(getFeedsFromApi())}} />;
};
