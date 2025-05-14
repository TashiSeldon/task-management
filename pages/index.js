// pages/index.js

import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch tasks after checking if the user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          router.push('/login');
        } else {
          alert('Error fetching tasks');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [router]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token
    router.push('/login'); // Redirect to login page
  };

  const handleMarkAsComplete = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/tasks/${taskId}`,
        { status: 'Completed' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh the task list
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, status: 'Completed' } : task
        )
      );
    } catch (error) {
      alert('Error marking task as complete');
    }
  };

  const handleDeleteTask = async (taskId) => {
    const confirmed = window.confirm('Are you sure you want to delete this task?');
    if (!confirmed) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove the task from the list
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      alert('Error deleting task');
    }
  };

  if (loading) {
    return <p>Loading tasks...</p>;
  }

  return (
    <div>
      <h1>Your Tasks</h1>
      {/* Logout button */}
      <button onClick={handleLogout}>Logout</button>
      <button onClick={() => router.push('/tasks/create')}>Create New Task</button>
      <ul>
        {tasks.length === 0 ? (
          <p>No tasks available</p>
        ) : (
          tasks.map((task) => (
            <li key={task.id}>
              <h2>{task.title}</h2>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>

              {/* Show Edit button only if status is not 'Completed' */}
              {task.status !== 'Completed' && (
                <>
                  <button onClick={() => router.push(`/tasks/${task.id}`)}>Edit</button>
                  <button onClick={() => handleMarkAsComplete(task.id)}>
                    Complete
                  </button>
                </>
              )}

              {/* Always show the Delete button with confirmation */}
              <button onClick={() => handleDeleteTask(task.id)}>Delete</button>

              {/* Show completed status if task is completed */}
              {task.status === 'Completed' && <p>✅ This task is completed</p>}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Dashboard;
