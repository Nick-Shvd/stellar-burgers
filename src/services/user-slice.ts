import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserApi,
  registerUserApi,
  TRegisterData,
  TAuthResponse,
  TLoginData,
  loginUserApi,
  logoutApi,
  updateUserApi,
  TUserResponse
} from '@api';
import { setCookie, deleteCookie } from '../utils/cookie';

export const checkUserAuth = createAsyncThunk(
  'userData/checkUserAuth',
  async () => {
    const response = await getUserApi();
    return response.user;
  }
);

export const registerUserData = createAsyncThunk<TAuthResponse, TRegisterData>(
  'userData/registerUserData',
  async (data) => {
    const registerRespons = await registerUserApi(data);
    setCookie('accessToken', registerRespons.accessToken);
    localStorage.setItem('refreshToken', registerRespons.refreshToken);
    return registerRespons;
  }
);

export const loginUserData = createAsyncThunk<TAuthResponse, TLoginData>(
  'userData/loginUserData',
  async (userLoginData: TLoginData) => {
    const loginedUser = await loginUserApi(userLoginData);
    setCookie('accessToken', loginedUser.accessToken);
    localStorage.setItem('refreshToken', loginedUser.refreshToken);
    return loginedUser;
  }
);

export const logoutUser = createAsyncThunk('userData/logOutUser', async () => {
  const logout = await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
  return logout;
});

export const updateUserData = createAsyncThunk<
  TUserResponse,
  Partial<TRegisterData>
>('userData/updateUserData', async (user: Partial<TRegisterData>) => {
  const update = await updateUserApi(user);
  return update;
});

type UserDataType = {
  isAuthChecked: boolean;
  user: TUser | null;
  authRequest: boolean;
  userRequest: boolean;
  error: string | null;
};

const userDataState: UserDataType = {
  isAuthChecked: false, // приложение уже проверило токен или ещё нет (есть ли пользователь или нема)
  user: null, //данные самого пользователя email name
  authRequest: false, //  лодер кнопок на страницах входа (Войти, Регистрация, Восстановить).
  userRequest: false, // лодер для действий с авторизованным пользователем
  error: null
};

export const userSlice = createSlice({
  name: 'userData',
  initialState: userDataState,
  reducers: {},
  selectors: {
    selectIsAuthChecked: (state) => {
      return state.isAuthChecked;
    },
    selectUser: (state) => {
      return state.user;
    }
  },
  extraReducers(builder) {
    builder.addCase(checkUserAuth.fulfilled, (state, action) => {
      state.isAuthChecked = true;
      state.user = action.payload;
    });
    builder.addCase(checkUserAuth.rejected, (state) => {
      state.isAuthChecked = true;
      state.user = null;
    });

    builder.addCase(registerUserData.pending, (state) => {
      state.authRequest = true;
      state.error = null;
    });
    builder.addCase(registerUserData.fulfilled, (state, action) => {
      state.authRequest = false;
      state.user = action.payload.user;
    });
    builder.addCase(registerUserData.rejected, (state, action) => {
      state.authRequest = false;
      state.error = action.error.message ?? 'Ошибка регистрации';
    });

    builder.addCase(loginUserData.pending, (state) => {
      state.authRequest = true;
      state.error = null;
    });
    builder.addCase(loginUserData.fulfilled, (state, action) => {
      state.authRequest = false;
      state.user = action.payload.user;
    });
    builder.addCase(loginUserData.rejected, (state, action) => {
      state.error = action.error.message ?? 'Ошибка входа';
      state.authRequest = false;
    });

    builder.addCase(logoutUser.fulfilled, (state) => {
      state.userRequest = false;
      state.user = null;
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.userRequest = false;
      state.error = action.error.message ?? 'Ошибка выхода';
    });

    builder.addCase(updateUserData.pending, (state) => {
      state.userRequest = true;
    });
    builder.addCase(updateUserData.fulfilled, (state, action) => {
      state.user = action.payload.user;
      state.userRequest = false;
    });
    builder.addCase(updateUserData.rejected, (state, action) => {
      state.error = action.error.message ?? 'Ошибка обновления данных';
      state.userRequest = false;
    });
  }
});
