import prisma from '../../database/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const registerUser = async (userData: any) => {
  const { email, password, name } = userData;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
    },
  });
  return user;
};

export const loginUser = async (credentials: any) => {
  const { email, password } = credentials;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

  return { user, token };
};
