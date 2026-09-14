import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getIngredientsApi } from "@api";
import { TIngredient } from "@utils-types";


export const getIngredients = createAsyncThunk(
    'ingredients/getIngredients',
    async ()=> {
        return getIngredientsApi()
    }
);

type stateIngridientsType = {
    ingredients: TIngredient[],
    isLoading: boolean,
    error: string | null
}

export const initialStateIngridients: stateIngridientsType = {
    ingredients: [],
    isLoading: false,
    error: null
}

export const ingredientsSlice = createSlice({
    name: "ingredients",
    initialState: initialStateIngridients,
    reducers: {},
    selectors: {
        selectedIngredient: (sliceState, id) => 
        sliceState.ingredients.find( (item) => item._id === id),

        selectDataIngredients: (sliceState)=> {
        return sliceState.ingredients
    },
    },
    extraReducers(builder) {
        builder.addCase(getIngredients.pending, (state) => {
            state.error = null;
            state.isLoading = true;
        })
        builder.addCase(getIngredients.fulfilled, (state, action) => {
            state.isLoading = false
            state.ingredients = action.payload
        })
        builder.addCase(getIngredients.rejected, (state, action) => {
            state.isLoading = false
            state.error = action.error.message || 'ошибочка'
        })
    }
}
)