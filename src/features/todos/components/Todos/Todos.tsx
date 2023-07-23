import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../../app/store";
import { BaseTodo, addTodoRequest } from "../../todosSlice";
import globalStyles from "styles/global.module.css";
import styles from "./Todos.module.css";
import { Todo } from "../Todo/Todo";
import classNames from "classnames";

export const Todos: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos);
  const dispatch = useDispatch<AppDispatch>();

  const [titleInput, setTitleInput] = useState("");
  const [descriptionInput, setDescriptionInput] = useState("");

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (titleInput.trim()) {
      const newTodo: BaseTodo = {
        title: titleInput.trim(),
        isCompleted: false,
        description: descriptionInput.trim()
      };

      dispatch(addTodoRequest(newTodo));
      setTitleInput("");
      setDescriptionInput("");
    }
  };

  const addTodoEnabled = titleInput.trim().length > 0;
  const addTodoClass = classNames([globalStyles.button], [styles.addTodo], {
    [globalStyles.disabledButton]: !addTodoEnabled
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Todo List</h2>
      <form onSubmit={handleAddTodo} className={styles.todoForm}>
        <input
          type="text"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          className={styles.todoInput}
          placeholder="What needs to be done?"
        />
        {/* <input
          type="text"
          value={descriptionInput}
          onChange={(e) => setDescriptionInput(e.target.value)}
          className={styles.todoInput}
          placeholder="Description"
        /> */}
        <button type="submit" className={addTodoClass}>
          Add
        </button>
      </form>
      <ul className={styles.todoList}>
        {todos.map((todo) => (
          <li key={todo.id}>
            <Todo todo={todo} />
          </li>
        ))}
      </ul>
    </div>
  );
};
