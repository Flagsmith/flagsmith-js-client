// run npm test:pact:server for a mocked api
module.exports = {
    foo: {
        get: {
            description: 'The endpoint description',
            path: '/foo/:id/bar',
            body: {
                data: {
                    foo: 123,
                },
            },
        },
    },
    login: {
        path: '/login',
        post: {
            description: 'Login as a user',
            body: {
                email: 'kyle@bla.com',
                name: 'Kyle',
                hasConfirmedEmail: false,
                token: 'secret',
            },
            requestBody: {
                id: '123',
                email: 'kyle@bla.com',
                password: 'secret',
                name: 'Kyle',
            },
        },
    },
};
