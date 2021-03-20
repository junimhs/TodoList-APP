<template>
    <div class="w-full sm:w-1/2 lg:w-1/3 mx-auto">
        <div class="flex items-center justify-between mb-8">
            <div class="text-gray-500 font-medium">
                Meu perfil
            </div>
        </div>

        <Message
            v-if="response.message"
            :color="response.color"
            :message="response.message"
        />

        <ValidationObserver
            ref="profileFormRef"
            tag="form"
            @submit.stop.prevent="updateUser"
        >
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <ValidationProvider
                        v-slot="{errors}"
                        rules="required"
                        name="Nome"
                    >
                        <label
                            for="firstName"
                            class="block text-sm text-gray-500 font-medium mb-2"
                        >
                            Primeiro nome
                        </label>

                        <input
                            id="firstName"
                            v-model="firstName"
                            type="text"
                            placeholder="Digite seu nome"
                            class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                        >
                        <div
                            v-if="!!errors[0]"
                            class="text-red-500 text-sm mb-4"
                        >
                            {{ errors[0] }}
                        </div>
                    </ValidationProvider>
                </div>

                <div>
                    <label
                        for="lastName"
                        class="block text-sm text-gray-500 font-medium mb-2"
                    >
                        Sobrenome
                    </label>

                    <input
                        id="lastName"
                        v-model="lastName"
                        type="text"
                        placeholder="Digite seu sobrenome"
                        class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                    >
                </div>
                <div>
                    <ValidationProvider
                        v-slot="{errors}"
                        name="Senha"
                        :rules="{required: false, min: 8, regex: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/}"
                        vid="passwordRef"
                    >
                        <label
                            for="password"
                            class="block text-sm text-gray-500 font-medium mb-2"
                        >
                            Senha
                        </label>

                        <input
                            id="password"
                            v-model="password"
                            type="password"
                            placeholder="Digite sua senha"
                            class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                        >
                        <div
                            v-if="!!errors"
                            class="text-red-500 text-sm mb-4"
                        >
                            {{ errors[0] }}
                        </div>
                    </ValidationProvider>
                </div>
                <div>
                    <ValidationProvider
                        v-slot="{errors}"
                        name="Confirmarção de senha"
                        :rules="{required: !!password, confirmed: 'passwordRef'}"
                    >
                        <label
                            for="confirmationPassword"
                            class="block text-sm text-gray-500 font-medium mb-2"
                        >
                            Confirmar senha
                        </label>

                        <input
                            id="confirmationPassword"
                            v-model="confirmation"
                            type="password"
                            placeholder="Confirmar senha"
                            class="bg-gray-900 placeholder-gray-700 text-gray-500 font-light border border-gray-900 focus:outline-none focus:border-blue-800 rounded-sm py-3 px-4 block w-full appearance-none leading-normal"
                        >
                        <div
                            v-if="!!errors"
                            class="text-red-500 text-sm mb-4"
                        >
                            {{ errors[0] }}
                        </div>
                    </ValidationProvider>
                </div>
                <div class="col-span-2 text-right">
                    <button
                        type="submit"
                        :disabled="spinner.update_user"
                        class="inline-flex items-center justify-center bg-blue-800 text-blue-200 font-medium text-sm focus:outline-none rounded-sm py-3 px-4 inline-block appearance-none leading-normal"
                    >
                        <img
                            v-if="spinner.update_user"
                            src="@/assets/img/spinner.svg"
                            alt=""
                            class="w-5 h-5 mr-2"
                        >

                        SALVAR
                    </button>
                </div>
            </div>
        </ValidationObserver>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { ValidationProvider, ValidationObserver } from 'vee-validate';
    import message from '@/utils/message';
    import Message from '@/components/Partials/Message';

    export default {
        name: 'Profile',
        components: {
            ValidationObserver,
            ValidationProvider,
            Message,
        },
        data() {
            return {
                firstName: '',
                lastName: '',
                password: '',
                confirmation: '',
                response: {
                    color: '',
                    message: '',
                },
                spinner: {
                    update_user: false,
                },
            };
        },
        computed: {
            ...mapState({
                user: state => state.user.user,
            }),
        },
        created() {
            this.firstName = this.user.first_name;
            this.lastName = this.user.last_name;
        },
        methods: {
            async updateUser() {
                const validation = await this.$refs.profileFormRef.validate();

                if(!validation) return;

                this.resetResponse();

                const payload = {
                    first_name: this.firstName,
                    last_name: this.lastName,
                    password: this.password,
                    password_confirmation: this.confirmation,
                };

                this.spinner.update_user = true;

                this.$axios.put('v1/me', payload).then((response) => {
                    this.response.color = 'green';
                    this.response.message = 'Seu dados foram atualizados com sucesso.';
                    this.$store.commit('user/STORE_USER', response.data.data);
                }).catch((e) => {
                    const errorCode = e?.response?.data?.error || 'ServeError';
                    this.response.color = 'red';
                    this.response.message = message[errorCode];
                }).finally(() => {
                    this.spinner.update_user = false;
                });
            },
            resetResponse() {
                this.response.color = '';
                this.response.message = '';
            },
        },
    };
</script>

<style scoped>

</style>