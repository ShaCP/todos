import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../../app/store';
import { Todo, addTodo, removeTodo, updateTodo } from '../../todosSlice';
import styles from './Todos.module.css';

export const Todos: React.FC = () => {
  const todos = useSelector((state: RootState) => state.todos);
  const dispatch = useDispatch();

  const [titleInput, setTitleInput] = useState('');
  const [descriptionInput, setDescriptionInput] = useState('');

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (titleInput.trim()) {
      const newTodo: Todo = {
        id: Date.now(),
        title: titleInput.trim(),
        isCompleted: false,
        description: descriptionInput.trim(),
      };
      dispatch(addTodo(newTodo));
      setTitleInput('');
      setDescriptionInput('');
    }
  };

  const handleRemoveTodo = (id: number) => {
    dispatch(removeTodo(id));
  };

  const handleToggleCompleted = (todo: Todo) => {
    const updatedTodo = { ...todo, isCompleted: !todo.isCompleted };
    dispatch(updateTodo(updatedTodo));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Todo List</h2>
      <form onSubmit={handleAddTodo} className={styles.inputContainer}>
        <input
          type="text"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          className={styles.todoInput}
          placeholder="Title"
        />
        <input
          type="text"
          value={descriptionInput}
          onChange={(e) => setDescriptionInput(e.target.value)}
          className={styles.todoInput}
          placeholder="Description"
        />
        <button type="submit" className={styles.addButton}>
          Add Todo
        </button>
      </form>
      <ul className={styles.todoList}>
        {todos.map((todo) => (
          <li key={todo.id} className={styles.todoItem}>
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
                  textDecoration: todo.isCompleted ? 'line-through' : 'none',
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
        ))}
      </ul>
    </div>
  );
};