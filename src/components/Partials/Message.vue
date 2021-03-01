<template>
    <div
        :class="`rounded-sm bg-${color}-100 p-4 mb-4`"
    >
        <h3 :class="`text-sm leading-5 font-medium text-${color}-800`">
            {{ message }}
        </h3>
    </div>
</template>
<script>
    export default {
        name: 'Message',
        props: ['color', 'message'],
    };
</script>