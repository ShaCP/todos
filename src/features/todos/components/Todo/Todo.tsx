import { useDispatch } from "react-redux";
import { ITodo, removeTodoRequest, updateTodo } from "../../todosSlice";
import globalStyles from "styles/global.module.css";
import styles from "./Todo.module.css";
import { AppDispatch } from "../../../../app/store";
import classNames from "classnames";

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

  const todoItemClass = classNames(styles.todoItem, {
    [styles.completed]: todo.isCompleted
  });

  return (
    <div className={todoItemClass}>
      <label className={styles.todoContent}>
        <input
          type="checkbox"
          checked={todo.isCompleted}
          onChange={() => handleToggleCompleted(todo)}
          className={`${styles.todoCheckbox} ${globalStyles.roundedCheckbox}`}
        />
        <span className={`${styles.todoText}`}>{todo.title}</span>
        <p className={styles.todoDescription}>{todo.description}</p>
      </label>
      <button
        onClick={() => handleRemoveTodo(todo.id)}
        className={styles.removeButton}
      >
        X
      </button>
    </div>
  );
};
