"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../config/database");
const errorHandler_1 = require("./errorHandler");
const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            throw new errorHandler_1.AppError('Token no proporcionado', 401);
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        const user = await database_1.prisma.usuario.findUnique({
            where: { id: decoded.id }
        });
        if (!user || !user.estado) {
            throw new errorHandler_1.AppError('Usuario no encontrado', 401);
        }
        req.user = user;
        next();
    }
    catch (error) {
        next(new errorHandler_1.AppError('No autorizado', 401));
    }
};
exports.authenticate = authenticate;
