import { Request, Response } from 'express';
import { z } from 'zod';
import { registerUser, loginUser } from './authService';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const register = async (req: Request, res: Response) => {
  try {
    const userData = registerSchema.parse(req.body);
    const user = await registerUser(userData);
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const credentials = loginSchema.parse(req.body);
    const { user, token } = await loginUser(credentials);
    res.status(200).json({ user, token });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req: Request, res: Response) => {
  // This route is protected, so if we reach here, the user is authenticated.
  // The user object should be available in req.user from the authMiddleware.
  // @ts-ignore
  res.status(200).json({ user: req.user });
};