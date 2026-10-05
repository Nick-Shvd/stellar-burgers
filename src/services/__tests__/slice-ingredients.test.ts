import { expect, test, describe } from '@jest/globals';
import { ingredientsSlice, getIngredients, initialStateIngridients } from '../../services/slice-ingredients';

const ingredientsSliceReducer = ingredientsSlice.reducer;

const mockIngredients = [
    {
        _id: '1',
        name: 'Булка',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 100,
        image: '',
        image_mobile: '',
        image_large: ''
    }
];

describe('редьюсер ingredients', () => {
    test('несуществующий экшен при undefined даёт начальное состояние', () => {
        const newState = ingredientsSliceReducer(undefined, { type: 'UNKNOWN' });
        expect(newState).toEqual(initialStateIngridients);
    });

    test('pending включает загрузку и сбрасывает ошибку', () => {
        const newState = ingredientsSliceReducer(
            initialStateIngridients,
            getIngredients.pending('reqId')
        );
        expect(newState).toEqual({ ...initialStateIngridients, isLoading: true, error: null });
    });

    test('fulfilled кладёт данные и выключает загрузку', () => {
        const newState = ingredientsSliceReducer(
            initialStateIngridients,
            getIngredients.fulfilled(mockIngredients, 'reqId', undefined)
        );
        expect(newState).toEqual({
            ...initialStateIngridients,
            isLoading: false,
            ingredients: mockIngredients
        });
    });

    test('rejected пишет ошибку и выключает загрузку', () => {
        const newState = ingredientsSliceReducer(
            initialStateIngridients,
            getIngredients.rejected(new Error('сеть упала'), 'reqId', undefined)
        );
        expect(newState).toEqual({
            ...initialStateIngridients,
            isLoading: false,
            error: 'сеть упала'
        });
    });
});