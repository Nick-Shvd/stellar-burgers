import { test, expect } from '@playwright/test';

test.describe("тест с HAR данными для ингредиентов и конструктора",  () => {

    test.beforeEach("добавление ингредиента из списка в конструктор", async ({page}) => {
    await page.routeFromHAR('./tests/hars/ingredients.har', {
        url: '**/api/ingredients',
    });

    await page.goto('/')

    const typeOfIngredientBun = page.getByText('Краторная булка N-200i');
    await expect(typeOfIngredientBun).toBeVisible(); //полуили булку из списка ингридиентов (ну и по идее впринципе загрузились данные )
    })

    test('добавили булочку', async({page}) => {
        await page.getByRole('button', {name: /Добавить/}).first().click();
    await expect(page.locator('.constructor-element_pos_top')).toContainText('Краторная булка N-200i');
    })
  
    test('добавили ингридиент', async({page}) => {

    await page.getByTestId('ingredientElement')
    .filter({ hasText: 'Биокотлета из марсианской Магнолии'})
    .getByRole('button', {name: /Добавить/}).click();
    await expect(page.locator('.constructor-element__row')).toContainText('Биокотлета из марсианской Магнолии');

    await page.getByTestId('ingredientElement')
    .filter({ hasText: 'Филе Люминесцентного тетраодонтимформа' })
    .getByRole('button', { name: /Добавить/ })
    .click();
    await expect(page.locator('.constructor-element__row').filter({ hasText: 'Филе Люминесцентного тетраодонтимформа'})).toBeVisible();
    });

    test('модалка с описанием ингридиента', async({page}) => {

        await page.getByTestId('ingredientElement')
        .filter({hasText: 'Краторная булка N-200i'}).click();
        
        await expect(page.getByTestId('modalWindow')).toContainText('Краторная булка N-200i');
    })

    test('закрытие модалки крестиком', async({page}) => {
         await page.getByTestId('ingredientElement')
        .filter({hasText: 'Краторная булка N-200i'}).click();

        await page.getByTestId('modalWindow').getByRole('button').click();
        await expect(page.getByTestId('modalWindow')).toBeHidden();
    })
    test('закрытие модалки оверлеем', async({page}) => {
        await page.getByTestId('ingredientElement')
        .filter({hasText: 'Краторная булка N-200i'}).click();

        await page.getByTestId('overlayModal').click({position: {x:0, y:0}});
        await expect(page.getByTestId('modalWindow')).toBeHidden();
    })
});

test.describe('создание заказа', () => {
    test.beforeEach(async ({ context, page }) => {
        await context.addCookies([{
            name: 'accessToken',
            value: 'Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYWI3YTViNmExNzJkMDAxYjk5NTI2MiIsImlhdCI6MTc5MTExNDk1OCwiZXhwIjoxNzkxMTE2MTU4fQ.3uWVsix4U9n5bipmdMQ_xuzNXlKcq0ixP9LoX7zHwqo',
            domain: 'localhost',
            path: '/'
        }]);
        await page.addInitScript(() => {
            localStorage.setItem('refreshToken', 'dd58be9c0106a0abdec6e7b34e9237e2b604e1ff79783741909d4041bb3371471fc15fef481b6f01');
        });
        await page.routeFromHAR('./tests/hars/ingredients.har', { url: '**/api/ingredients' });
        await page.routeFromHAR('./tests/hars/auth-user.har', { url: '**/api/auth/user' });
        await page.routeFromHAR('./tests/hars/order.har', { url: '**/api/orders' });
        await page.goto('/');
        await page.waitForResponse('**/api/ingredients');
    });

    test('полный цикл оформления заказа', async ({ page }) => {
        // пункт 4: собираем бургер
        await page.getByRole('button', { name: /Добавить/ }).first().click();
        await page.getByTestId('ingredientElement')
            .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
            .getByRole('button', { name: /Добавить/ }).click();
        await page.getByTestId('ingredientElement')
            .filter({ hasText: 'Соус Spicy-X' })
            .getByRole('button', { name: /Добавить/ }).click();

        // пункт 5: оформляем
        await page.getByRole('button', { name: /Оформить заказ/ }).click();

        // пункт 6: модалка открылась и номер верный
        await expect(page.getByRole('heading', { name: '110912' })).toBeVisible();

        // пункт 7: конструктор пуст
        await expect(page.getByText('Выберите начинку')).toBeVisible();

        // пункт 8: закрываем и проверяем закрытие
        await page.getByTestId('modalWindow').getByRole('button').click();
        await expect(page.getByTestId('modalWindow')).toBeHidden();

    });
});