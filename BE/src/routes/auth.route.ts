import { Router } from "express"
import { AuthService } from "../services/auth.service"

export const AuthRoute = Router()

AuthRoute.post('/login', async (req, res) => {
    try {
        res.json(await AuthService.login(req.body))
    } catch (e) {
        res.status(401).json({
            message: e.message,
            timestamp: new Date()
        })
    }
})

AuthRoute.post('/refresh', async (req, res) => {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        res.json(await AuthService.refresh(token))
    } catch (e) {
        res.status(401).json({
            message: e.message,
            timestamp: new Date()
        })
    }
})