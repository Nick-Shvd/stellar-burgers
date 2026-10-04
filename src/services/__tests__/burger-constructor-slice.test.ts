import { expect, test, describe } from '@jest/globals';
import { burgerConstrucorSlice } from '../../services/burger-constructor-slice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

const reducer = burgerConstrucorSlice.reducer;
const { addProduct, resetConstructor, removeProduct, productUp, productDoww } = burgerConstrucorSlice.actions;

const bun: TIngredient = {
    _id: 'b1', name: 'Булка', type: 'bun',
    proteins: 80, fat: 24, carbohydrates: 53, calories: 420,
    price: 100, image: '', image_mobile: '', image_large: ''
};
const meat: TIngredient = {
    _id: 'm1', name: 'Котлета', type: 'main',
    proteins: 10, fat: 10, carbohydrates: 10, calories: 100,
    price: 200, image: '', image_mobile: '', image_large: ''
};
const sauce: TIngredient = {
    _id: 's1', name: 'Соус', type: 'sauce',
    proteins: 1, fat: 1, carbohydrates: 1, calories: 10,
    price: 50, image: '', image_mobile: '', image_large: ''
};

describe('редьюсер burgerConstructor', () => {
    test('несуществующий экшен даёт начальное состояние', () => {
        const newState = reducer(undefined, { type: 'UNKNOWN' });
        expect(newState).toEqual({ bun: null, ingredients: [] });
    });

    test('addProduct кладёт булку в bun', () => {
        const newState = reducer(undefined, addProduct(bun));
        expect(newState.bun?.name).toBe('Булка');
        expect(newState.bun?._id).toBeDefined();
    });

    test('addProduct добавляет котлету и соус в ingredients', () => {
        let state = reducer(undefined, addProduct(meat));
        state = reducer(state, addProduct(sauce));
        expect(state.ingredients).toHaveLength(2);
        expect(state.ingredients[0].name).toBe('Котлета');
    });

    test('removeProduct удаляет по id', () => {
        let state = reducer(undefined, addProduct(meat));
        const id = state.ingredients[0].id;
        state = reducer(state, removeProduct(id));
        expect(state.ingredients).toHaveLength(0);
    });

    test('productUp поднимает элемент', () => {
        let state = reducer(undefined, addProduct(meat));
        state = reducer(state, addProduct(sauce));
        state = reducer(state, productUp(1));
        expect(state.ingredients[0].name).toBe('Соус');
        expect(state.ingredients[1].name).toBe('Котлета');
    });

    test('productDoww опускает элемент', () => {
        let state = reducer(undefined, addProduct(meat));
        state = reducer(state, addProduct(sauce));
        state = reducer(state, productDoww(0));
        expect(state.ingredients[0].name).toBe('Соус');
    });

    test('resetConstructor очищает всё', () => {
        let state = reducer(undefined, addProduct(bun));
        state = reducer(state, addProduct(meat));
        state = reducer(state, resetConstructor());
        expect(state.bun).toBeNull();
        expect(state.ingredients).toHaveLength(0);
    });
});