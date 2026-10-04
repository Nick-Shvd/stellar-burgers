import{ test, expect }from "@playwright/test";

test('доступ к профилю авторизованного пользователя', async ({context, page})=> {

    await context.addCookies([{
        name: 'accessToken',
        value: 'Bearer%20eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhYWI3YTViNmExNzJkMDAxYjk5NTI2MiIsImlhdCI6MTc5MTExNDk1OCwiZXhwIjoxNzkxMTE2MTU4fQ.3uWVsix4U9n5bipmdMQ_xuzNXlKcq0ixP9LoX7zHwqo',
        domain: 'localhost',
        path: '/'
    }])

    await page.routeFromHAR('./tests/hars/auth-user.har', {
        url: '**/api/auth/user',
       // update: true
    })

    await page.goto('/')
    await page.waitForResponse('**/api/auth/user')

})