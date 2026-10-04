import { test, expect } from '@playwright/test';

test("запрос для подмены данных для ингредиентов", async ({page}) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
        url: '**/api/ingredients',
     //update: true // загрузили реальные данные с сервера и далее работаем в режиме воспроизведения 
    });

    await page.goto('/')

    await expect(page.getByTestId('ingredientElement').first()).toBeVisible();
    
})