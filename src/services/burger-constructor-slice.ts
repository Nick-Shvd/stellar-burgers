import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import { TIngredient
 } from "@utils-types";
import { TConstructorIngredient } from "@utils-types";

type constructorItemType = {
    bun: TIngredient | null
    ingredients: TConstructorIngredient[]
  };

const stateBurgerConstructorItem: constructorItemType = {
    bun: null,
    ingredients: []
}

export const burgerConstrucorSlice = createSlice({
    name: 'addedIngredients',
    initialState: stateBurgerConstructorItem,
    reducers: {
        addProduct: { 
            reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
            if (action.payload.type === 'bun') {
               state.bun = action.payload 
            }
            if ( action.payload.type === 'sauce' || action.payload.type === 'main') {
                state.ingredients.push(action.payload)
            }},
            prepare: (ingredient: TIngredient)=> ({payload: {...ingredient, id: nanoid()}})
        },
        
        resetConstructor: (state) => {
            state.bun = null;
            state.ingredients = [];
        },

        removeProduct: (state, action: PayloadAction<string>) => {
            state.ingredients = state.ingredients.filter((item) =>  item.id !== action.payload )
        },

        productUp: (state, action)=> {
            const index = action.payload
            const [element] = state.ingredients.splice(index, 1)
            state.ingredients.splice(index - 1, 0, element)
        },

        productDoww: (state, action) => {
            const index = action.payload;
            const [elem] = state.ingredients.splice(index, 1);
            state.ingredients.splice(index + 1, 0, elem)
        }
        }
})

