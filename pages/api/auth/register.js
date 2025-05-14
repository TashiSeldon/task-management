//pages/api/auth/register.js
import { hashPassword } from '../../../lib/auth';
import prisma from '../../../lib/prisma';
import { validateInput } from '../../../utils/validateInput';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const passwordStrength = validateInput(password);
    if (!passwordStrength.isValid) {
      return res.status(400).json({ error: passwordStrength.message });
    }

    try {
      // Check if the username already exists
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        return res.status(400).json({ error: 'Username already exists' });
      }

      // Check if the email already exists
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingEmail) {
        return res.status(400).json({ error: 'Email already exists' });
      }

      // Hash the password
      const hashedPassword = await hashPassword(password);

      // Create a new user
      const newUser = await prisma.user.create({
        data: {
          name,
          username,
          email,
          password: hashedPassword,
        },
      });

      // Send success response
      return res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
