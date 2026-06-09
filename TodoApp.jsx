
import React, { useState } from 'react';


const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');


  const handleAddTodo = () => {
    if (inputValue.trim() !== '') {
      setTodos([...todos, { text: inputValue, completed: false }]);
      setInputValue('');
    }
  };


  const handleDeleteTodo = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };


  const handleToggleTodo = (index) => {
    const newTodos = [...todos];
    newTodos[index].completed = !newTodos[index].completed;
    setTodos(newTodos);
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };


  return (
    <div className="todo-container">
      <h2>My Tasks</h2>
      <div className="input-group">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
        />
        <button onClick={handleAddTodo}>
          Add
        </button>
      </div>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggleTodo(index)}
                style={{ width: '20px', height: '20px', accentColor: '#764ba2', cursor: 'pointer', flex: 'none' }}
              />
              <span className={todo.completed ? 'completed-text' : ''}>
                {todo.text}
              </span>
            </div>
            <button
              className="delete-btn"
              onClick={() => handleDeleteTodo(index)}
              aria-label="Delete task"
            >
              &times;
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};


export default TodoApp;


