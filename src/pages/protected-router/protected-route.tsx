import { ReactNode } from 'react';
import { useSelector } from '../../services/store';
import { userSlice } from '../../services/user-slice';
import { Preloader } from '@ui';
import { Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { loadOptions } from '@babel/core';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactNode;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(userSlice.selectors.selectIsAuthChecked);
  const user = useSelector(userSlice.selectors.selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!user && !onlyUnAuth) {
    return <Navigate replace to='/login' state={{ from: location.pathname }} />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || '/';

    return <Navigate replace to={from} />;
  }

  return children;
};
