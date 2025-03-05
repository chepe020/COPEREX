import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectToDatabase } from './mongo.js';
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
    application.use("/companySystem/v1/auth", authenticationRoutes);
    application.use("/companySystem/v1/companies", organizationRoutes);
};
 
const createAdminUser = async () => {
    try {
        const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
 
        if (!existingAdmin) {
            const hashedPassword = await hash("Admin123");
 
            const newAdmin = new User({
                name: "Admin",
                surname: "Principal",
                username: "admin",
                email: "admin@gmail.com",
                phone: "12345678",
                password: hashedPassword
            });
 
            await newAdmin.save();
            console.log("Administrator successfully created.");
        } else {
            console.log("Administrator already exists.");
        }
    } catch (error) {
        console.error("Error creating the administrator:", error);
    }
};
 
const initializeDatabaseConnection = async () => {
    try {
        await connectToDatabase();
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