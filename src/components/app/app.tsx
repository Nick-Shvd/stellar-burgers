import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ProtectedRoute } from '../../pages/protected-router';
import { useDispatch, useSelector } from '../../services/store'
import { useEffect } from 'react';
import { userSlice, checkUserAuth } from '../../services/user-slice';

const App = () => {
  /** TODO: взять переменные из стора */

  const navigate = useNavigate();
  const toBack = () => navigate(-1);
  const dispatch = useDispatch();

  useEffect(()=> {
    dispatch(checkUserAuth());
  }, [])

  return (
    
      <div className={styles.app}>
        <AppHeader />

        <Routes>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route
            path='/feed/:number'
            element={
              <Modal title='Информация о заказе' onClose={toBack}>
                <OrderInfo />
              </Modal>
            }
          />

          <Route
            path='/login'
            element={
              <ProtectedRoute onlyUnAuth>
                <Login />
              </ProtectedRoute>
            }
          />

          <Route
            path='/register'
            element={
              <ProtectedRoute onlyUnAuth>
                <Register />
              </ProtectedRoute>
            }
          />

          <Route
            path='/forgot-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ForgotPassword />
              </ProtectedRoute>
            }
          />

          <Route
            path='/reset-password'
            element={
              <ProtectedRoute onlyUnAuth>
                <ResetPassword />
              </ProtectedRoute>
            }
          />

          <Route
            path='/profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }/>

            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <Modal title='Информация о заказе с профилем' onClose={toBack}>
                    <OrderInfo />
                  </Modal>
                </ProtectedRoute>
              }
            />
            
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Ингредиенты' onClose={toBack}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route path='*' element={<NotFound404 />} />
        </Routes>
      </div>
    
  );
};

export default App;
