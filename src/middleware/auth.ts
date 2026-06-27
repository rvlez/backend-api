import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/database';
import { AppError } from './errorHandler';

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      throw new AppError('Token no proporcionado', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await prisma.usuario.findUnique({
      where: { id: decoded.id }
    });

    if (!user || !user.estado) {
      throw new AppError('Usuario no encontrado', 401);
    }

    (req as any).user = user;
    next();
  } catch (error) {
    next(new AppError('No autorizado', 401));
  }
};