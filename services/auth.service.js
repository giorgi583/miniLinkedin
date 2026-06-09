const { z} = require('zod')
const jwt = require('jsonwebtoken')
const {userSchemaMDB} = require('../models/user-schema')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
dotenv.config({path: './.env', quiet: true})
const registerSchema = z.object({
    username: z.string().min(2).max(100),
    email: z.string().email(),
    password: z.string().min(6).max(100)
})

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(100)
})

async function register(req, res) {
    try {
        const validation = registerSchema.safeParse(req.body)
        if (!validation.success) {
            return res.status(400).json({success: false, message: 'Invalid input', error: validation.error.errors })
        }
        const { username, email, password } = validation.data
        const existingUser = await userSchemaMDB.findOne({ email })
        if (existingUser) {
            return res.status(409).json({success: false, message: 'User already exists' })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = await userSchemaMDB.create({ username, email, password: hashedPassword })
        return res.status(201).json({success: true, message: 'User created successfully', user: { id: user.id, username, email } })
    } catch (error) {
        console.error(error)
        return res.status(500).json({success: false, message: 'Internal server error' })
    }
}
async function login(req, res) {
    try {
        const validation = loginSchema.safeParse(req.body)
        if (!validation.success) {
            return res.status(400).json({success: false, message: 'Invalid input', error: validation.error.errors })
        }
        const { email, password } = validation.data
        const user = await userSchemaMDB.findOne({ email })
        if (!user) {
            return res.status(401).json({success: false, message: 'Invalid email or password' })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({success: false, message: 'Invalid email or password' })
        }
        const payload = { id: user.id, email: user.email }
        const token = jwt.sign(payload, process.env.JWT_SECRET || 'your_jwt_secret_key', { expiresIn: process.env.JWT_EXPIRES_IN || '24h' })
        return res.status(200).json({success: true, message: 'Login successful', user: { id: user.id, username: user.username, email: user.email }, token: `Bearer ${token}` })
        }
catch (error) {
        return res.status(500).json({success: false, message: 'Internal server error' })
    }

}

async function getMe(req, res) {
return res.status(200).json({success: true, message: 'User info retrieved successfully', user: req.user })
}
module.exports = { register, login, getMe }