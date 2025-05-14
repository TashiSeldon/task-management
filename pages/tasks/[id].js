// pages/tasks/[id].js

import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const EditTask = () => {
  const [task, setTask] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState('Pending'); // Default to Pending status

  const router = useRouter();
  const { id } = router.query;

  // ✅ Check if the user is authenticated via JWT
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const fetchTask = async () => {
      try {
        const response = await axios.get(`/api/tasks/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = response.data;
        setTask(data);
        setTitle(data.title);
        setDescription(data.description);
        setDueDate(data.dueDate?.split('T')[0]);
        setStatus(data.status || 'Pending');
      } catch (error) {
        console.error('Error fetching task:', error);
        alert('Error fetching task');
      }
    };

    if (id) fetchTask();
  }, [id]);

  // Handle task update (edit)
  const handleEditTask = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `/api/tasks/${id}`,
        { title, description, dueDate, status },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      router.push('/');
    } catch (err) {
      alert('Error updating task');
    }
  };

  // Handle task completion
  const handleCompleteTask = async () => {
    const token = localStorage.getItem('token');

    try {
      await axios.put(
        `/api/tasks/${id}`,
        { status: 'Completed' },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setStatus('Completed');
    } catch (err) {
      alert('Error marking task as complete');
    }
  };

  // Handle task deletion with confirmation
  const handleDeleteTask = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    const token = localStorage.getItem('token');

    try {
      await axios.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      router.push('/');
    } catch (err) {
      alert('Error deleting task');
    }
  };

  if (!task) {
    return <p>Loading task...</p>;
  }

  return (
    <div>
      <h1>Edit Task</h1>
      <form onSubmit={handleEditTask}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          disabled={status === 'Completed'} // Disable editing if completed
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          disabled={status === 'Completed'} // Disable editing if completed
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          disabled={status === 'Completed'} // Disable editing if completed
        />
        <button type="submit" disabled={status === 'Completed'}>
          Update Task
        </button>
      </form>

      {/* Show complete button only if not completed */}
      {status !== 'Completed' && (
        <button onClick={handleCompleteTask}>Complete</button>
      )}

      {/* Show delete button only if not completed */}
      {status !== 'Completed' && (
        <button onClick={handleDeleteTask}>Delete</button>
      )}

      <p>Status: {status}</p>
    </div>
  );
};

export default EditTask;
