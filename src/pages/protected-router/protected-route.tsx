import { ReactNode } from 'react';
import { useSelector } from '../../services/store';
import { userSlice } from '../../services/user-slice';
import { Preloader } from '@ui';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactNode;
};


export const ProtectedRoute = ({ children, onlyUnAuth}: ProtectedRouteProps) => {

  const isAuthChecked = useSelector(userSlice.selectors.selectIsAuthChecked)
  const user = useSelector(userSlice.selectors.selectUser);

  if (!isAuthChecked) { //пока не пришел ответ с сервера ждем 
    return <Preloader/>
  }

  if (!user && !onlyUnAuth) {
    return <Navigate replace to='/login'/> //если нет пользователя и маршрут для авторизованного пользователя => предлагаем зарегестрироваться
  }

  if (onlyUnAuth && user) {
    return <Navigate to='/' replace/> 
  }

  return children;
}

