<template>
    <div class="w-full sm:w-1/2 lg:w-1/3 mx-auto">
        <div class="flex items-center justify-between mb-8">
            <div class="text-gray-500 font-medium">
                Lista de tarefas
            </div>
        </div>

        <Message
            v-if="response.message"
            :color="response.color"
            :message="response.message"
        />

        <form
            class="flex items-center px-4 bg-gray-300 h-15 rounded-sm mb-3"
            @submit.stop.prevent="createTodo"
        >
            <input
                v-model="newTodo"
                placeholder="Digite o nome da sua lista ..."
                type="text"
                class="bg-gray-300 placeholder-gray-500 text-gray-700 font-light focus:outline-none block w-full appearance-none leading-normal pr-3"
            >

            <button
                type="submit"
                class="text-blue-700 text-xs font-semibold focus:outline-none"
            >
                ADICIONAR
            </button>
        </form>

        <div
            v-if="spinner.get_todos"
            class="text-center"
        >
            <img
                src="@/assets/img/spinner.svg"
                alt=""
                class="inline-block w-5 h-5"
            >
        </div>

        <TodoCard
            v-for="todo in todos"
            :key="todo.id"
            :todo="todo"
            @afterDeleting="afterDeleting"
        />
        <div
            v-if="todos.length"
            v-observe-visibility="getPaginateTodos"
        />
    </div>
</template>

<script>
    import Message from '@/components/Partials/Message';
    import TodoCard from '@/components/Todo/TodoCard';

    export default {
        name: 'Home',
        components: {
            Message,
            TodoCard,
        },
        data() {
            return {
                newTodo: '',
                todos: [],
                page: 1,
                last_page: 0,
                response: {
                    color: '',
                    message: '',
                },
                spinner: {
                    get_todos: false,
                },
            };
        },
        created() {
            this.getAllTodos();
        },
        methods: {
            getAllTodos() {
                this.spinner.get_todos = true;
                this.$axios.get(`v1/todos?page=${this.page}`).then((response) => {
                    this.todos.push(...response.data.data.map((o) => ({
                        ...o,
                        state: 'show',
                    })));
                    this.last_page = response.data.meta.last_page;
                }).finally(() => {
                    this.spinner.get_todos = false;
                });
            },
            getPaginateTodos(isVisible) {
                if(!isVisible) return;
                if(this.page >= this.last_page) return;
                this.page++;
                this.getAllTodos();
            },
            createTodo() {
                if(!this.newTodo) return;
                this.resetResponse();
                this.spinner.get_todos = true;
                this.$axios.post('v1/todos', { label: this.newTodo }).then((response) => {
                    this.response.color = 'green';
                    this.response.message = 'Todo criada com sucesso';
                    this.todos.unshift({...response.data.data, state: 'show'});

                    this.newTodo = '';

                    setTimeout(() => {
                        this.resetResponse();
                    }, 4000);
                }).finally(() => {
                    this.spinner.get_todos = false;
                });
            },
            resetResponse() {
                this.response.color = '';
                this.response.message = '';
            },
            afterDeleting(todo) {
                const idx = this.todos.findIndex(o => o.id === todo.id);
                this.todos.splice(idx, 1);

                this.response.color = 'green';
                this.response.message = 'Todo deletada com sucesso';

                setTimeout(() => {
                    this.resetResponse();
                }, 4000);
            },
        },
    };
</script>