import test, { expect } from "@playwright/test";

test('cоздание моковых данных для оформления заказа', async ({page, context}) => {
    
    test.setTimeout(90_000);

    await context.addCookies([{
        name: 'accessToken',
        value: 'Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYWI3YTViNmExNzJkMDAxYjk5NTI2MiIsImlhdCI6MTc5MTExNDk1OCwiZXhwIjoxNzkxMTE2MTU4fQ.3uWVsix4U9n5bipmdMQ_xuzNXlKcq0ixP9LoX7zHwqo',
        domain: 'localhost',
        path: '/'
    }]);

    await page.addInitScript(()=> {
        localStorage.setItem('refreshToken', 'dd58be9c0106a0abdec6e7b34e9237e2b604e1ff79783741909d4041bb3371471fc15fef481b6f01');
    });

    await page.routeFromHAR('./tests/hars/order.har', {
        url: '**/api/orders',
       // update: true
    });
    await page.goto('/')
    await page.waitForResponse('**/api/ingredients')

    // Собираем бургер
    await page.getByRole('button', { name: /Добавить/ }).first().click();
    await page.getByTestId('ingredientElement')
        .filter({ hasText: 'Биокотлета из марсианской Магнолии' })
        .getByRole('button', { name: /Добавить/ })
        .click();
    await page.getByTestId('ingredientElement')
        .filter({ hasText: 'Соус Spicy-X' })
        .getByRole('button', { name: /Добавить/ })
        .click();

    // оформляем заказ
    const orderResponse = page.waitForResponse(response =>
        response.url().includes('/api/orders') && response.request().method() === 'POST'
    );
    await page.getByRole('button', { name: /Оформить заказ/ }).click();
    await orderResponse;

    // проверяем что модалка появилась
    await expect(page.getByRole('heading')).toContainText('№');
});
