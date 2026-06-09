const express = require('express')
const authRouter = express.Router()
const { register, login, getMe } = require('../services/auth.service')
const { authenticateToken } = require('../middlewares/auth')

authRouter.post('/register', register)
authRouter.post('/login', login)
authRouter.get('/me', authenticateToken, getMe)
module.exports = authRouter