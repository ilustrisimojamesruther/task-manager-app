// TaskManager.js

import React, { useState, useEffect } from 'react';
import './App.css';

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
    const confirmDelete = window.confirm('Are you sure you want to delete this task?');
    if (!confirmDelete) {
      return;
    }
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
    <div className='task-manager-body' >
      <div style={{ textAlign: 'center', marginTop: '50px', marginBottom: '50px' }}>
        <h1>Task Manager</h1>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '400px' }}>
            <div>
              <label>Title:</label>
              <input type="text" name="title" value={newTask.title} onChange={handleInputChange} style={{ width: '100%', marginBottom: '10px' }} />
            </div>
            <div>
              <label>Description:</label>
              <textarea name="description" value={newTask.description} onChange={handleInputChange} style={{ width: '100%', marginBottom: '10px' }} />
            </div>
            <div>
              <label>Due Date:</label>
              <input type="date" name="due_date" value={newTask.due_date} onChange={handleInputChange} style={{ width: '100%', marginBottom: '10px' }} />
            </div>
            <button onClick={handleAddTask} style={{ backgroundColor: '#007bff', color: '#fff', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Add Task</button>
            <ul style={{ listStyleType: 'none', padding: '0', marginTop: '20px', textAlign: 'left' }}>
              {tasks.map(task => (
                <li key={task.task_id} style={{ marginBottom: '20px', backgroundColor: '#f0f0f0', border: '1px solid #ddd', borderRadius: '8px', padding: '10px' }}>
                  <div style={{ background: '#ddd', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
                    <strong>{task.title}</strong>
                  </div>
                  <div style={{ background: '#ddd', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
                    <p>{task.description}</p>
                  </div>
                  <p style={{ fontSize: '12px', marginLeft: '1%' }}>Due date</p>
                  <div style={{ background: '#ddd', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
                    <p>{task.due_date}</p>
                  </div>
                  <p style={{ fontSize: '12px', marginLeft: '1%' }}>Status:</p>
                  <div style={{ background: '#ddd', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
                    <p>{task.status}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                  <button className='button-delete' onClick={() => handleDeleteTask(task.task_id)}>Delete</button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;
