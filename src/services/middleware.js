import Cookie from 'js-cookie';

export default {
    requiredIfAuthenticate(to, from, next) {
        const token = Cookie.get('_todolist_token');
        let n;
        if(token) {
            n = { name: 'home' };
        }

        // Checar se o token esta invalido

        next(n);
    },

    requiredIfNotAuthenticate(to, from, next) {
        const token = Cookie.get('_todolist_token');
        let n;
        if(!token) {
            n = { name: 'login' };
        }

        next(n);
    },
};