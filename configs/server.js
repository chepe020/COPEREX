import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import requestLimiter from '../src/middlewares/validar-cant-peticiones.js';
import authenticationRoutes from '../src/auth/auth.routes.js';
import organizationRoutes from '../src/Business/businessroutes.js';
import User from "../src/users/user.model.js";
import { hash } from "argon2";
 
const setupMiddlewares = (application) => {
    application.use(express.urlencoded({ extended: false }));
    application.use(cors());
    application.use(express.json());
    application.use(helmet());
    application.use(morgan('dev'));
    application.use(requestLimiter);
};
 
const setupRoutes = (application) => {
    application.use("/coperex/v1/auth", authenticationRoutes);
    application.use("/coperex/v1/busines", organizationRoutes);
};
 
const createAdminUser = async () => {
    try {
        const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
 
        if (!existingAdmin) {
            const hashedPassword = await hash("12345678");
 
            const newAdmin = new User({
                name: "admin",
                surname: "principal",
                username: "admin",
                email: "admin@gmail.com",
                phone: "12345678",
                password: hashedPassword
            });
 
            await newAdmin.save();
            console.log("Administrado creado exitosamente");
        } else {
            console.log("Administrador Ya existe ");
        }
    } catch (error) {
        console.error("Error al crear el Administrador:", error);
    }
};
 
const initializeDatabaseConnection = async () => {
    try {
        await dbConnection();
        console.log("Successfully connected to the database.");
    } catch (error) {
        console.error("Database connection error:", error);
    }
};
 
export const startServer = async () => {
    const application = express();
    const serverPort = process.env.PORT || 3000;
 
    await initializeDatabaseConnection();
    await createAdminUser();
    setupMiddlewares(application);
    setupRoutes(application);
 
    application.listen(serverPort, () => {
        console.log(`Server is running on port ${serverPort}`);
    });
};