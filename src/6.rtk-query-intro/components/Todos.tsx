import {
  useGetTodosQuery,
  useAddTodoMutation,
  useDeleteTodoMutation,
  useUpdateTodoMutation,
} from '../features/api/apiSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faUpload } from '@fortawesome/free-solid-svg-icons';
import { type FormEvent } from 'react';

const TodoList = () => {
  const {
    data: todos,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTodosQuery('todos');
  const [addTodo] = useAddTodoMutation();
  const [updateTodo] = useUpdateTodoMutation();
  const [deleteTodo] = useDeleteTodoMutation();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newTodo = formData.get('new-todo') as string;
    if (!newTodo) return;
    addTodo({ userId: 1, title: newTodo, completed: false });

    e.currentTarget.reset();
  };

  const newItemSection = (
    <form onSubmit={handleSubmit} className="form-todo">
      <label htmlFor="new-todo" className="label-todo">
        Enter a new todo item
      </label>
      <div className="new-todo">
        <input
          type="text"
          className="input-todo"
          id="new-todo"
          name="new-todo"
          placeholder="Enter new todo"
        />
      </div>
      <button className="submit button-todo">
        <FontAwesomeIcon icon={faUpload} />
      </button>
    </form>
  );

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    content = todos?.map((todo) => (
      <article key={todo.id} className="article-todo">
        <div className="todo">
          <input
            type="checkbox"
            className="input-todo"
            checked={todo.completed}
            id={todo.id}
            onChange={() => updateTodo({ ...todo, completed: !todo.completed })}
          />
          <label htmlFor={todo.id}>{todo.title}</label>
        </div>
        <button
          className="trash button-todo"
          onClick={() => deleteTodo(todo.id)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </article>
    ));
  } else if (isError) {
    content = <p>{String(error)}</p>;
  }

  return (
    <main className="main-todo">
      <h1>Todo List</h1>
      {newItemSection}
      {content}
    </main>
  );
};
export default TodoList;
