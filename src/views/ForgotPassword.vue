<template>
    <div>
        <h3 class="py-2 mb-4 text-gray-500 text-lg font-medium text-center">
            Esqueci minha senha
        </h3>

        <Message
            v-if="response.message"
            :color="response.color"
            :message="response.message"
        />

        <ValidationObserver
            ref="forgotPasswordForm"
            tag="form"
            @submit.stop.prevent="forgotPassword"
        >
            <div class="grid gap-2">
                <ValidationProvider
                    v-slot="{ errors }"
                    name="E-mail"
                    rules="required|email"
                >
                    <input
                        v-model="email"
                        type="email"
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

                <button
                    type="submit"
                    :disabled="spinner.forgot_password"
                    class="flex items-center justify-center bg-blue-800 text-blue-200 font-medium text-sm focus:outline-none rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                >
                    <img
                        v-if="spinner.forgot_password"
                        src="@/assets/img/spinner.svg"
                        alt=""
                        class="w-5 h-5 mr-2"
                    >

                    RECUPERAR SENHA
                </button>

                <div class="my-4 text-center">
                    <RouterLink
                        :to="{ name: 'login' }"
                        class="text-sm font-light"
                    >
                        Login
                    </RouterLink>
                </div>
            </div>
        </ValidationObserver>
    </div>
</template>

<script>
    import Message from '@/components/Partials/Message';
    import { ValidationObserver, ValidationProvider } from 'vee-validate';
    import message from '@/utils/message';

    export default {
        name: 'ForgotPassword',
        components: {
            Message,
            ValidationObserver,
            ValidationProvider,
        },
        data() {
            return {
                email: '',
                spinner: {
                    forgot_password: false,
                },
                response: {
                    color: '',
                    message: '',
                },
            };
        },
        methods: {
            async forgotPassword() {
                const validated = this.$refs.forgotPasswordForm.validate();
                if(!validated) return;

                this.resetResponse();

                this.spinner.forgot_password = true;
                this.$axios.post('v1/forgot-password', { email: this.email }).then(() => {
                    this.response.color = 'green';
                    this.response.message = 'E-mail de recuperação enviado com sucesso.';
                    this.resetForm();
                }).catch((e) => {
                    const errorCode = e?.response?.data?.error || 'ServeError';
                    this.response.color = 'red';
                    this.response.message = message[errorCode];
                }).finally(() => {
                    this.spinner.forgot_password = false;
                });
            },

            resetResponse() {
                this.response.color = '';
                this.response.message = '';
            },

            resetForm() {
                this.email = '';
                this.$refs.forgotPasswordForm.reset();
            },
        },
    };
</script>
