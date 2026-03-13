import { IsNull } from "typeorm"
import { AppDataSource } from "../db"
import { Researcher } from "../entities/Researcher"
import { LoginModel } from "../models/login.model"
import { configDotenv } from "dotenv"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const repo = AppDataSource.getRepository(Researcher)
configDotenv()

const accessSecret = process.env.JWT_ACCESS_SECRET
const accessTTL = parseInt(process.env.JWT_ACCESS_TTL || "3600")
const refreshSecret = process.env.JWT_REFRESH_SECRET
const refreshTTL = parseInt(process.env.JWT_REFRESH_TTL || "86400")

export class AuthService {
    static async login(model: LoginModel) {
        const researcher = await this.getByEmail(model.email)

        if (await bcrypt.compare(model.password, researcher.password)) {
            const payload = {
                researcherId: researcher.researcherId,
                email: researcher.email,
                name: researcher.name,
                title: researcher.title
            }
            return {
                researcherId: researcher.researcherId,
                email: researcher.email,
                name: researcher.name,
                title: researcher.title,
                access: jwt.sign(payload, accessSecret, { expiresIn: accessTTL }),
                refresh: jwt.sign(payload, refreshSecret, { expiresIn: refreshTTL })
            }
        }

        throw new Error("Pogrešan email ili šifra")
    }

    static async refresh(token: string) {
        const decoded: any = jwt.verify(token, refreshSecret)
        const payload = {
            researcherId: decoded.researcherId,
            email: decoded.email,
            name: decoded.name,
            title: decoded.title
        }
        return {
            access: jwt.sign(payload, accessSecret, { expiresIn: accessTTL }),
            refresh: token
        }
    }

    static async getByEmail(email: string) {
        const data = await repo.findOne({
            where: {
                email: email,
                deletedAt: IsNull()
            }
        })

        if (data == undefined)
            throw new Error("Istraživač nije pronađen")

        return data
    }

    static async verifyToken(req: any, res: any, next: any) {
        if (req.path === '/api/auth/login' || req.path === '/api/auth/refresh') {
            next()
            return
        }

        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]

        if (token == undefined) {
            res.status(401).json({
                message: 'Token nije pronađen',
                timestamp: new Date()
            })
            return
        }

        jwt.verify(token, accessSecret, (err: any, researcher: any) => {
            if (err) {
                res.status(403).json({
                    message: 'Nevažeći token',
                    timestamp: new Date()
                })
                return
            }

            req.researcher = researcher
            next()
        })
    }
}