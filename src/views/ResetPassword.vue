<template>
    <div>
        <h3 class="py-2 mb-4 text-gray-500 text-lg font-medium text-center">
            Resetar senha
        </h3>

        <Message
            v-if="response.message"
            :color="response.color"
            :message="response.message"
        />
        <ValidationObserver
            ref="resetPasswordForm"
            tag="form"
            @submit.stop.prevent="resetPassword"
        >
            <div class="grid gap-2">
                <ValidationProvider
                    name="Senha"
                    :rules="{required: true, min: 8, regex: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/}"
                    v-slot="{ errors }"
                    vid="passwordRef"
                >
                    <input
                        v-model="password"
                        type="password"
                        placeholder="Digite sua nova senha"
                        class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                    >

                    <div
                        v-if="!!errors[0]"
                        class="text-red-500 text-sm mb-4"
                    >
                        {{ errors[0] }}
                    </div>
                </ValidationProvider>
                <ValidationProvider
                    name="Confirmarção de senha"
                    rules="required|confirmed:passwordRef"
                    v-slot="{ errors }"
                >
                    <input
                        v-model="confirmation"
                        type="password"
                        placeholder="Confirmar senha"
                        class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                    >

                    <div
                        v-if="!!errors[0]"
                        class="text-red-500 text-sm mb-4"
                    >
                        {{ errors[0] }}
                    </div>
                </ValidationProvider>
                <button
                    type="submit"
                    :disabled="spinner.reset_password"
                    class="flex items-center justify-center bg-blue-800 text-blue-200 font-medium text-sm focus:outline-none rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                >
                    <img
                        v-if="spinner.reset_password"
                        src="@/assets/img/spinner.svg"
                        alt=""
                        class="w-5 h-5 mr-2"
                    >

                    RESETAR SENHA
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
    import { ValidationObserver, ValidationProvider } from 'vee-validate';
    import Message from '@/components/Partials/Message';
    import message from '@/utils/message';

    export default {
        name: 'ResetPassword',
        components: {
            Message,
            ValidationObserver,
            ValidationProvider,
        },
        data() {
            return {
                password: '',
                confirmation: '',
                token: '',
                response: {
                    color: '',
                    message: '',
                },
                spinner: {
                    reset_password: false,
                },
            };
        },
        beforeRouteEnter(to, from, next) {
            if(!to?.query?.token) {
                next({name: 'login'});
            }

            next();
        },
        created() {
            this.token = this.$route?.query?.token;
        },
        methods: {
            async resetPassword() {
                const validated = await this.$refs.resetPasswordForm.validate();

                if(!validated) return;

                const payload = {
                    token: this.token,
                    password: this.password,
                    password_confirmation: this.confirmation,
                };

                this.resetResponse();

                this.spinner.reset_password = true;

                this.$axios.post('v1/reset-password', payload).then(() => {
                    this.response.color = 'green';
                    this.response.message = 'Senha alterada com sucesso.';
                    this.resetForm();
                }).catch((e) => {
                    const errorCode = e?.response?.data?.error || 'ServeError';
                    this.response.color = 'red';
                    this.response.message = message[errorCode];
                }).finally(() => {
                    this.spinner.reset_password = false;
                });
            },
            resetResponse() {
                this.response.color = '';
                this.response.message = '';
            },
            resetForm() {
                this.password = '',
                this.confirmation = '';
                this.$refs.resetPasswordForm.reset();
            },
        },
    };
</script>