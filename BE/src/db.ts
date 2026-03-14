import dotenv from 'dotenv'
import { DataSource } from "typeorm";
import { Category } from './entities/Category'
import { Facility } from './entities/Facility'
import { Instrument } from './entities/Instrument'
import { Researcher } from './entities/Researcher'
import { ResearchGroup } from './entities/ResearchGroup'
import { Reservation } from './entities/Reservation'
import { Admin } from './entities/Admin'
import path from 'path';

dotenv.config()

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log("DB User: ", process.env.DB_USER);
console.log("DB Password: ", process.env.DB_PASSWORD);
console.log("DB Host: ", process.env.DB_HOST);
console.log("DB Name: ", process.env.DB_NAME);
console.log("DB Port: ", process.env.DB_PORT);

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Category, Facility, Instrument, Researcher, ResearchGroup, Reservation, Admin],
    logging: false
})