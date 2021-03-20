<template>
    <div>
        <TodoCardShow
            v-if="isStateShow"
            :todo="todo"
            @update="changeStateToUpdate"
            @delete="changeStateToDelete"
        />
        <TodoCardUpdate
            v-if="isStateUpdating"
            :todo="todo"
            @cancel="changeStateToShow"
        />
        <TodoCardDelete
            v-if="isStateDeleting"
            :todo="todo"
            @cancel="changeStateToShow"
            @afterDeleting="afterDeleting"
        />
    </div>
</template>

<script>
    import TodoCardShow from '@/components/Todo/TodoCardShow';
    import TodoCardUpdate from '@/components/Todo/TodoCardUpdate';
    import TodoCardDelete from '@/components/Todo/TodoCardDelete';

    export default {
        name: 'TodoCard',
        components: {
            TodoCardShow,
            TodoCardUpdate,
            TodoCardDelete,
        },
        props: {
            todo: {
                type: Object,
                default: () => ({}),
            },
        },
        computed: {
            isStateShow() {
                return this.todo.state === 'show';
            },
            isStateUpdating() {
                return this.todo.state === 'update';
            },
            isStateDeleting() {
                return this.todo.state === 'delete';
            },
        },
        methods: {
            changeStateToShow() {
                this.todo.state = 'show';
            },
            changeStateToDelete() {
                this.todo.state = 'delete';
            },
            changeStateToUpdate() {
                this.todo.state = 'update';
            },
            afterDeleting(todo) {
                this.$emit('afterDeleting', todo);
            },
        },
    };
</script>

<style scoped>

</style>