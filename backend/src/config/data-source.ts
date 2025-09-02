import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "../models/User";
import dotenv from 'dotenv'
dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true, ///  only For the developer . change during the deployement 
    logging: process.env.NODE_ENV === "development",
    entities: [User],
})