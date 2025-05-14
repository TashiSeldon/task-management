// /pages/api/tasks/[id].js

import { authenticateToken } from '../../../lib/authMiddleware';
import prisma from '../../../lib/prisma';

const handler = async (req, res) => {
  const { method } = req;
  const { id } = req.query;

  try {
    const userId = req.user.userId;

    const task = await prisma.task.findUnique({
      where: { id },
    });

    if (!task || task.userId !== userId) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    // ✅ GET - Fetch single task
    if (method === 'GET') {
      return res.status(200).json(task);
    }

    // ✅ PUT - Update task
    if (method === 'PUT') {
      const { title, description, dueDate, status } = req.body;

      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          ...(title && { title }),
          ...(description && { description }),
          ...(dueDate && { dueDate: new Date(dueDate) }),
          ...(status && { status }),
        },
      });

      return res.status(200).json(updatedTask);
    }

    // ✅ DELETE - Delete task
    if (method === 'DELETE') {
      await prisma.task.delete({
        where: { id },
      });

      return res.status(200).json({ message: 'Task deleted successfully' });
    }

    // ❌ Method not allowed
    return res.status(405).json({ message: 'Method Not Allowed' });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export default authenticateToken(handler);
