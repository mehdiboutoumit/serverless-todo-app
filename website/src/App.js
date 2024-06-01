// import React, { useState } from 'react';

// function TodoList() {
//   const [todos, setTodos] = useState([]);
//   const [inputValue, setInputValue] = useState('');

//   function handleChange(e) {
//     setInputValue(e.target.value);
//   }

//   function handleSubmit(e) {
//     e.preventDefault();
//     setTodos([...todos, { text: inputValue, completed: false }]);
//     setInputValue('');
//   }

//   const handleDelete = (index) => {
//     const newTodos = [...todos];
//     newTodos.splice(index, 1);
//     setTodos(newTodos);
//   };

//   const handleToggleComplete = (index) => {
//     const newTodos = todos.map((todo, i) => 
//       i === index ? { ...todo, completed: !todo.completed } : todo
//     );
//     setTodos(newTodos);
//   };

//   return (
//     <div>
//       <h1>Todo List</h1>
//       <form onSubmit={handleSubmit}>
//         <input type="text" value={inputValue} onChange={handleChange} />
//         <button type="submit">Add Todo</button>
//       </form>
//       <ul>
//         {todos.map((todo, index) => (
//           <li key={index} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
//             {todo.text}
//             <button onClick={() => handleToggleComplete(index)}>
//               {todo.completed ? 'Undo' : 'Complete'}
//             </button>
//             <button onClick={() => handleDelete(index)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default TodoList;

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'https://19pw6b2xd3.execute-api.us-east-1.amazonaws.com/production/todos';

function TodoList() { 
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(JSON.parse(response.data.body))
     
    } catch (error) {
      console.error("Error fetching todos:", error);
      console.log(todos);
      
    }
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newTodo = { id: Date.now().toString(), text: inputValue, completed: false };
      await axios.put(`${API_URL}/one`, { body: JSON.stringify(newTodo) });
      setTodos([...todos, newTodo]);
      setInputValue('');
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/one`, { data: { body: JSON.stringify({ id }) } });
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      await axios.patch(`${API_URL}/one`, { body: JSON.stringify({ id }) });
      setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    } catch (error) {
      console.error("Error completing todo:", error);
    }
  };

  const handleEdit = async (id, newText) => {
    try {
      await axios.put(`${API_URL}/one`, { body: JSON.stringify({ id, text: newText }) });
      setTodos(todos.map(todo => todo.id === id ? { ...todo, text: newText } : todo));
    } catch (error) {
      console.error("Error editing todo:", error);
    }
  };

  return (
    <div>
      <h1>Todo List</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={inputValue} onChange={handleChange} />
        <button type="submit">Add Todo</button>
      </form>
      <ul>
        {todos.map((todo, index) => (
          <li key={index} style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
            <input 
              type="text" 
              value={todo.text} 
              onChange={(e) => handleEdit(todo.id, e.target.value)}
              style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}
            />
            <button onClick={() => handleToggleComplete(todo.id)}>
              {todo.completed ? 'Undo' : 'Complete'}
            </button>
            <button onClick={() => handleDelete(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;



