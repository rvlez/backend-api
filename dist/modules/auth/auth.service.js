"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const database_1 = require("../../config/database");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("../../middleware/errorHandler");
class AuthService {
    async login(email, password) {
        const user = await database_1.prisma.usuario.findUnique({
            where: { email }
        });
        if (!user || !user.estado) {
            throw new errorHandler_1.AppError('Credenciales inválidas', 401);
        }
        const isValid = await bcrypt_1.default.compare(password, user.password);
        if (!isValid) {
            throw new errorHandler_1.AppError('Credenciales inválidas', 401);
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '24h' });
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
exports.AuthService = AuthService;
