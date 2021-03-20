<template>
    <div style="height: 300px">
        <LoginMenu />

        <Message
            v-if="response.message"
            :color="response.color"
            :message="response.message"
        />
        <ValidationObserver
            ref="registerForm"
            tag="form"
            @submit.stop.prevent="register"
        >
            <div class="grid gap-2">
                <div class="flex">
                    <div class="w-1/2 mr-2">
                        <ValidationProvider
                            name="Primeiro nome"
                            v-slot="{ errors }"
                            rules="required"
                        >
                            <input
                                v-model="first_name"
                                type="text"
                                placeholder="Digite seu primeiro nome"
                                class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                            >

                            <div
                                v-if="!!errors[0]"
                                class="text-red-500 text-sm mb-2"
                            >
                                {{ errors[0] }}
                            </div>
                        </ValidationProvider>
                    </div>
                    <div class="w-1/2 ml-2">
                        <input
                            type="text"
                            placeholder="Digite seu sobrenome"
                            class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                        >
                    </div>
                </div>
                <ValidationProvider
                    name="E-mail"
                    v-slot="{ errors }"
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
                        class="text-red-500 text-sm mb-2"
                    >
                        {{ errors[0] }}
                    </div>
                </ValidationProvider>
                <ValidationProvider
                    v-slot="{ errors }"
                    :rules="{ required: true, min: 8 , regex: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/ }"
                    name="Senha"
                >
                    <input
                        v-model="password"
                        type="password"
                        placeholder="Digite sua senha"
                        class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                    >
                    <div
                        v-if="!!errors[0]"
                        class="text-red-500 text-sm mb-2"
                    >
                        {{ errors[0] }}
                    </div>
                </ValidationProvider>
                <button
                    type="submit"
                    :disabled="spinner.register"
                    class="flex items-center justify-center bg-blue-800 text-blue-200 font-medium text-sm focus:outline-none rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                >
                    <img
                        v-if="spinner.register"
                        src="@/assets/img/spinner.svg"
                        class="h-5 w-5"
                    >
                    REGISTRAR
                </button>
            </div>
        </ValidationObserver>
    </div>
</template>

<script>
    import LoginMenu from '@/components/Auth/LoginMenu';
    import Message from '@/components/Partials/Message';
    import message from '@/utils/message';
    import {ValidationObserver, ValidationProvider} from 'vee-validate';

    export default {
        name: 'Register',
        components: {
            LoginMenu,
            ValidationObserver,
            ValidationProvider,
            Message,
        },
        data() {
            return {
                first_name: '',
                last_name: '',
                email: '',
                password: '',
                response: {
                    color: '',
                    message: '',
                },
                spinner: {
                    register: false,
                },
            };
        },
        methods: {
            async register() {
                const validate = await this.$refs.registerForm.validate();

                if(!validate) return;

                this.resetResponse();

                const payload = {
                    first_name: this.first_name,
                    last_name: this.last_name,
                    email: this.email,
                    password: this.password,
                };

                this.spinner.register = true;

                this.$axios.post('v1/register', payload).then(() => {
                    this.response.color = 'green';
                    this.response.message = 'Seu cadastrado foi feito com sucesso.';
                    this.resetForm();
                }).catch((e) => {
                    const errorCode = e?.response?.data?.error || 'ServeError';
                    this.response.color = 'red';
                    this.response.message = message[errorCode];
                }).finally(() => {
                    this.spinner.register = false;
                });
            },
            resetResponse() {
                this.response.color = '';
                this.response.message = '';
            },
            resetForm() {
                this.first_name = '';
                this.last_name = '';
                this.email = '';
                this.password = '';
                this.$refs.registerForm.reset();
            },
        },
    };
</script>