import { IsNull } from "typeorm"
import { AppDataSource } from "../db"
import { Researcher } from "../entities/Researcher"
import { Admin } from "../entities/Admin"
import { LoginModel } from "../models/login.model"
import { configDotenv } from "dotenv"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const researcherRepo = AppDataSource.getRepository(Researcher)
const adminRepo = AppDataSource.getRepository(Admin)
configDotenv()

const accessSecret = process.env.JWT_ACCESS_SECRET
const accessTTL = parseInt(process.env.JWT_ACCESS_TTL || "3600")
const refreshSecret = process.env.JWT_REFRESH_SECRET
const refreshTTL = parseInt(process.env.JWT_REFRESH_TTL || "86400")

export class AuthService {
    static async unifiedLogin(model: LoginModel) {
        // prvo proveravamo admin tabelu
        try {
            const admin = await this.getAdminByEmail(model.email)
            if (await bcrypt.compare(model.password, admin.password)) {
                const payload = {
                    adminId: admin.adminId,
                    email: admin.email,
                    name: admin.name,
                    role: 'admin'
                }
                return {
                    adminId: admin.adminId,
                    email: admin.email,
                    name: admin.name,
                    role: 'admin',
                    access: jwt.sign(payload, accessSecret, { expiresIn: accessTTL }),
                    refresh: jwt.sign(payload, refreshSecret, { expiresIn: refreshTTL })
                }
            }
        } catch (e) {
            // nije admin, nastavljamo
        }

        // onda proveravamo researcher tabelu
        const researcher = await this.getResearcherByEmail(model.email)
        if (await bcrypt.compare(model.password, researcher.password)) {
            const payload = {
                researcherId: researcher.researcherId,
                email: researcher.email,
                name: researcher.name,
                title: researcher.title,
                role: 'researcher'
            }
            return {
                researcherId: researcher.researcherId,
                email: researcher.email,
                name: researcher.name,
                title: researcher.title,
                role: 'researcher',
                access: jwt.sign(payload, accessSecret, { expiresIn: accessTTL }),
                refresh: jwt.sign(payload, refreshSecret, { expiresIn: refreshTTL })
            }
        }

        throw new Error("Pogrešan email ili šifra")
    }

    static async login(model: LoginModel) {
        const researcher = await this.getResearcherByEmail(model.email)

        if (await bcrypt.compare(model.password, researcher.password)) {
            const payload = {
                researcherId: researcher.researcherId,
                email: researcher.email,
                name: researcher.name,
                title: researcher.title,
                role: 'researcher'
            }
            return {
                researcherId: researcher.researcherId,
                email: researcher.email,
                name: researcher.name,
                title: researcher.title,
                role: 'researcher',
                access: jwt.sign(payload, accessSecret, { expiresIn: accessTTL }),
                refresh: jwt.sign(payload, refreshSecret, { expiresIn: refreshTTL })
            }
        }

        throw new Error("Pogrešan email ili šifra")
    }

    static async adminLogin(model: LoginModel) {
        const admin = await this.getAdminByEmail(model.email)

        if (await bcrypt.compare(model.password, admin.password)) {
            const payload = {
                adminId: admin.adminId,
                email: admin.email,
                name: admin.name,
                role: 'admin'
            }
            return {
                adminId: admin.adminId,
                email: admin.email,
                name: admin.name,
                role: 'admin',
                access: jwt.sign(payload, accessSecret, { expiresIn: accessTTL }),
                refresh: jwt.sign(payload, refreshSecret, { expiresIn: refreshTTL })
            }
        }

        throw new Error("Pogrešan email ili šifra")
    }

    static async refresh(token: string) {
        const decoded: any = jwt.verify(token, refreshSecret)

        if (decoded.role === 'admin') {
            const payload = {
                adminId: decoded.adminId,
                email: decoded.email,
                name: decoded.name,
                role: 'admin'
            }
            return {
                access: jwt.sign(payload, accessSecret, { expiresIn: accessTTL }),
                refresh: token
            }
        }

        const payload = {
            researcherId: decoded.researcherId,
            email: decoded.email,
            name: decoded.name,
            title: decoded.title,
            role: 'researcher'
        }
        return {
            access: jwt.sign(payload, accessSecret, { expiresIn: accessTTL }),
            refresh: token
        }
    }

    static async getResearcherByEmail(email: string) {
        const data = await researcherRepo.findOne({
            where: { email: email, deletedAt: IsNull() }
        })
        if (data == undefined)
            throw new Error("Istraživač nije pronađen")
        return data
    }

    static async getAdminByEmail(email: string) {
        const data = await adminRepo.findOne({
            where: { email: email, deletedAt: IsNull() }
        })
        if (data == undefined)
            throw new Error("Admin nije pronađen")
        return data
    }

    static async verifyToken(req: any, res: any, next: any) {
        if (req.path === '/api/auth/login' ||
            req.path === '/api/auth/unified-login' ||
            req.path === '/api/auth/admin/login' ||
            req.path === '/api/auth/refresh') {
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

        jwt.verify(token, accessSecret, (err: any, user: any) => {
            if (err) {
                res.status(403).json({
                    message: 'Nevažeći token',
                    timestamp: new Date()
                })
                return
            }

            req.user = user
            next()
        })
    }
}