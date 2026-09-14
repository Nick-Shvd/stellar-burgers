import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { TOrder } from "@utils-types"
import { getFeedsApi, orderBurgerApi, getOrdersApi} from "@api"

type orderDataType = {
    userOrders: TOrder[],
    feedsOrders: TOrder[],
    total: number,
    totalToday: number,
    error: string | null,
    orderRequest: boolean,
    feedsRequest: boolean,
    orderModalData: TOrder | null,
   userOrdersRequest: boolean,
}

const initialOrderData: orderDataType = {
    userOrders: [],
    feedsOrders: [],
    total: 0,
    totalToday: 0,
    error: '',
    userOrdersRequest: false,
    orderRequest: false, // это значение передается в конструктор бургера отсюда через селектор
    feedsRequest: false,
    orderModalData: null
}
export const getOrdersLogin = createAsyncThunk (
    'orderData/getOrderApi',
    async () => {
        return getOrdersApi();
    }
)

export const postOrderApi = createAsyncThunk(
    'orderData/postOrderApi',
    async (data: string[]) => {
        return orderBurgerApi(data);
    }
)

export const getFeedsFromApi = createAsyncThunk(
    'orderData/getFeedsApi',
    async ()=> {
       return getFeedsApi();
    }
)

export const orderSlice = createSlice({
    name: 'orderData',
    initialState: initialOrderData,
    reducers: {
        clearOrderData: (state) => {
            state.orderModalData = null
        }
    },
    selectors: {
        selectFeeds: (sliceState) => {
            return sliceState.feedsOrders;
        },
        selectTotal: (sliceState) => {
          return sliceState.total;
        },
        selectTotalToday: (sliceState) => {
            return sliceState.totalToday;
        },
        selectUserOrders: (sliceState) => {
            return sliceState.userOrders;
        },
        selectUserOrdersRequest: (sliceState) => sliceState.userOrdersRequest
    },
    extraReducers(builder) {
        builder.addCase(getFeedsFromApi.pending, (state)=> {
            state.feedsRequest = true
        })
        builder.addCase(getFeedsFromApi.fulfilled, (state, action)=> {
            state.feedsRequest = false;
            state.feedsOrders = action.payload.orders;
            state.total = action.payload.total;
            state.totalToday = action.payload.totalToday;
        })
        builder.addCase(getFeedsFromApi.rejected, (state, action)=> {
            state.feedsRequest = false;
            state.error = action.error.message ?? 'Ошибка загрузки'
        })

        builder.addCase(postOrderApi.pending, (state)=> {
            state.orderRequest = true;
        })
        builder.addCase(postOrderApi.fulfilled, (state, action) => {
            state.orderRequest = false;
            state.orderModalData = { ...action.payload.order, ingredients: action.meta.arg };
        })
        builder.addCase(postOrderApi.rejected, (state, action)=> {
            state.orderRequest = false;
            state.error = action.error.message ?? 'Ошибка отрправки заказа'
        })

        builder.addCase(getOrdersLogin.pending, (state)=> {
            state.userOrdersRequest = true;
        })
        builder.addCase(getOrdersLogin.fulfilled, (state, action)=> {
            state.userOrdersRequest = false;
            state.userOrders = action.payload;
        })
        builder.addCase(getOrdersLogin.rejected, (state, action)=> {
            state.userOrdersRequest = false;
            state.error = action.error.message ?? 'Ошибка получения заказов';
        })
    }
}
)