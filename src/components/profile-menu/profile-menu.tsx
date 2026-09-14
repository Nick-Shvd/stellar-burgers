import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/user-slice';
import { burgerConstrucorSlice } from '../../services/burger-constructor-slice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();

  const handleLogout = () => {dispatch(logoutUser());
    dispatch(burgerConstrucorSlice.actions.resetConstructor());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
