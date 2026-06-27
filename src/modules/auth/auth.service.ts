import { prisma } from '../../config/database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppError } from '../../middleware/errorHandler';

export class AuthService {
  async login(email: string, password: string) {
    const user = await prisma.usuario.findUnique({
      where: { email }
    });

    if (!user || !user.estado) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new AppError('Credenciales inválidas', 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    return {
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol
      },
      token
    };
  }
}