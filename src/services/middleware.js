import Cookie from '@/services/cookie';
import axios from 'axios';

export default {
    requiredIfAuthenticate(to, from, next) {
        const token = Cookie.getToken();
        let n;
        if(token) {
            n = { name: 'home' };
        }
        next(n);
    },

    async requiredIfNotAuthenticate(to, from, next) {
        const token = Cookie.getToken;
        let n;
        if(!token) {
            n = { name: 'login' };
        }

        // Checar se o token esta invalido
        await axios.get('v1/me').catch(() => {
            Cookie.deleteToken();
            next({ name: 'login' });
        });

        next(n);
    },
};