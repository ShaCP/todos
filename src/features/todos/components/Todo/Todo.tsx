import { useDispatch } from "react-redux";
import { ITodo, removeTodoRequest, updateTodo } from "../../todosSlice";
import styles from "./Todo.module.css";
import { AppDispatch } from "../../../../app/store";

type TodoProps = {
  todo: ITodo;
};

export const Todo: React.FC<TodoProps> = ({ todo }: TodoProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleRemoveTodo = (id: number) => {
    dispatch(removeTodoRequest(id));
  };

  const handleToggleCompleted = (todo: ITodo) => {
    const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
    dispatch(updateTodo(updatedTodo));
  };

  return (
    <li className={styles.todoItem}>
      <input
        type="checkbox"
        checked={todo.isCompleted}
        onChange={() => handleToggleCompleted(todo)}
        className={styles.todoCheckbox}
      />
      <div className={styles.todoContent}>
        <span
          className={styles.todoText}
          style={{
            textDecoration: todo.isCompleted ? "line-through" : "none"
          }}
        >
          {todo.title}
        </span>
        <p className={styles.todoDescription}>{todo.description}</p>
      </div>
      <button
        onClick={() => handleRemoveTodo(todo.id)}
        className={styles.removeButton}
      >
        Remove
      </button>
    </li>
  );
};
