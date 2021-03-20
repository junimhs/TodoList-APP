<template>
    <div>
        <img
            v-if="spinner.verify_email"
            src="@/assets/img/spinner.svg"
            class="inline-flex w-5 h-5"
        >

        <Message
            v-if="response.message"
            :color="response.color"
            :message="response.message"
        />
    </div>
</template>

<script>

    import Message from '@/components/Partials/Message';
    import message from '@/utils/message';

    export default {
        name: 'VerifyEmail',
        components: {Message},
        data() {
            return {
                token: '',
                response: {
                    color: '',
                    message: '',
                },
                spinner: {
                    verify_email: false,
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
            this.verifyEmail();
        },
        methods: {
            verifyEmail() {
                this.spinner.verify_email = true;
                this.$axios.post('v1/verify-email', { token: this.token }).then(() => {
                    this.response.color = 'green';
                    this.response.message = 'Seu e-mail foi verificado com sucesso';
                }).catch((e) => {
                    const errorCode = e?.response?.data?.error || 'ServeError';
                    this.response.color = 'red';
                    this.response.message = message[errorCode];
                }).finally(() => {
                    this.spinner.verify_email = false;
                });
            },
        },
    };
</script>