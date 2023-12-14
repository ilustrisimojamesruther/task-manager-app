// TaskManager.js

import React, { useState, useEffect } from 'react';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    due_date: '',
    user_id: 1, // Set the user_id as needed
  });

  useEffect(() => {
    // Fetch tasks from Flask API
    fetch('http://localhost:5000/tasks')
      .then(response => response.json())
      .then(data => setTasks(data.tasks))
      .catch(error => console.error('Error fetching tasks:', error));
  }, []); // Empty dependency array means this effect runs once on component mount

  const handleInputChange = e => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = () => {
    fetch('http://localhost:5000/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to create task');
        }
        return response.json();
      })
      .then(data => {
        // Update the local state with the new task
        setTasks([...tasks, data.task]);
      })
      .catch(error => console.error('Error creating task:', error));

    // Clear the new task form
    setNewTask({
      title: '',
      description: '',
      due_date: '',
      user_id: 1, // Set the user_id as needed
    });
  };

  const handleDeleteTask = taskId => {
    fetch(`http://localhost:5000/tasks/${taskId}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete task');
        }
      })
      .then(() => {
        // Update the local state by removing the deleted task
        setTasks(tasks.filter(task => task.task_id !== taskId));
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <ul>
        {tasks.map(task => (
          <li key={task.task_id}>
            <strong>{task.title}</strong>
            <p>{task.description}</p>
            <p>Due Date: {task.due_date}</p>
            <p>Status: {task.status}</p>
            <button onClick={() => handleDeleteTask(task.task_id)}>Delete</button>
          </li>
        ))}
      </ul>
      <div>
        <label>Title:</label>
        <input type="text" name="title" value={newTask.title} onChange={handleInputChange} />
      </div>
      <div>
        <label>Description:</label>
        <textarea name="description" value={newTask.description} onChange={handleInputChange} />
      </div>
      <div>
        <label>Due Date:</label>
        <input type="date" name="due_date" value={newTask.due_date} onChange={handleInputChange} />
      </div>
      <button onClick={handleAddTask}>Add Task</button>
    </div>
  );
};

export default TaskManager;
