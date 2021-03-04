<template>
    <div style="height: 300px;">
        <LoginMenu />

        <Message
            v-if="response.message"
            :color="response.color"
            :message="response.message"
        />
        <ValidationObserver
            tag="form"
            ref="loginForm"
            @submit.stop.prevent="login"
        >
            <div class="grid gap-2">
                <ValidationProvider
                    v-slot="{ errors }"
                    name="E-mail"
                    rules="required|email"
                >
                    <input
                        v-model="email"
                        type="text"
                        placeholder="Digite seu e-mail"
                        class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                    >
                    <div
                        v-if="!!errors[0]"
                        class="text-red-500 text-sm mb-2 mt-1"
                    >
                        {{ errors[0] }}
                    </div>
                </ValidationProvider>

                <ValidationProvider
                    v-slot="{ errors }"
                    name="Senha"
                    rules="required"
                >
                    <input
                        v-model="password"
                        type="password"
                        placeholder="Digite sua senha"
                        class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                    >
                    <div
                        v-if="!!errors[0]"
                        class="text-red-500 text-sm mb-2 mt-1"
                    >
                        {{ errors[0] }}
                    </div>
                </ValidationProvider>

                <button
                    type="submit"
                    :disabled="spinner.login"
                    class="flex items-center justify-center bg-blue-800 text-blue-200 font-medium text-sm focus:outline-none rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                >
                    <img
                        v-if="spinner.login"
                        src="@/assets/img/spinner.svg"
                        class="h-5 w-5"
                    >
                    ENTRAR
                </button>

                <div class="my-4 text-center">
                    <RouterLink
                        :to="{name: 'forgotPassword'}"
                        class="text-sm font-light"
                    >
                        Esqueci minha senha
                    </RouterLink>
                </div>
            </div>
        </ValidationObserver>
    </div>
</template>

<script>
    import LoginMenu from '@/components/Auth/LoginMenu';
    import Message from '@/components/Partials/Message';
    import Cookie from 'js-cookie';
    import { ValidationObserver, ValidationProvider } from 'vee-validate';
    import message from '@/utils/message';

    export default {
        name: 'Login',

        components: {
            LoginMenu,
            ValidationObserver,
            ValidationProvider,
            Message,
        },

        data() {
            return {
                email: '',
                password: '',
                response: {
                    color: '',
                    message: '',
                },
                spinner: {
                    login: false,
                },
            };
        },
        methods: {
            async login() {
                const validate = await this.$refs.loginForm.validate();

                if(!validate) return;

                const payload = {
                    'email': this.email,
                    'password': this.password,
                };

                this.resetResponse();
                this.spinner.login = true;

                this.$axios.post('v1/login', payload).then((response) => {
                    const token = `${response.data.token_type} ${response.data.access_token}`;
                    Cookie.set('_todolist_token', token, { expires: 30 });

                    this.$store.commit('user/STORE_USER', response.data.data);
                    this.$router.push({ name: 'home' });
                }).catch((e) => {
                    const errorCode = e?.response?.data?.error || 'ServeError';
                    this.response.color = 'red';
                    this.response.message = message[errorCode];
                }).finally(() => {
                    this.spinner.login = false;
                });
            },
            resetResponse() {
                this.response.color = '';
                this.response.message = '';
            },
        },
    };
</script>
