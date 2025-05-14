// /pages/api/tasks/index.js

import { authenticateToken } from '../../../lib/authMiddleware'; // Import the middleware
import prisma from '../../../lib/prisma';

const handler = async (req, res) => {
  const userId = req.user.userId; // This is set by the middleware

  if (req.method === 'GET') {
    try {
      console.log('✅ userId from token:', userId); // Add this line
      const tasks = await prisma.task.findMany({
        where: { userId },
      });
      return res.status(200).json(tasks);
    } catch (error) {
      console.error('❌ Error fetching tasks:', error); // More detailed logging
      return res.status(500).json({ error: 'Unable to fetch tasks' });
    }
  }
  

  if (req.method === 'POST') {
    const { title, description, dueDate } = req.body;

    if (!title || !description || !dueDate) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const newTask = await prisma.task.create({
        data: {
          title,
          description,
          dueDate: new Date(dueDate), // Ensure proper Date format
          userId, // Set the userId of the task
        },
      });

      return res.status(201).json(newTask);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Unable to create task' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
};

export default authenticateToken(handler); // Wrap the handler with the middleware
