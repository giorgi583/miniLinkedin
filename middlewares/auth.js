const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config({path: './.env', quiet: true})
const {userSchemaMDB} = require('../models/user-schema')

async function authenticateToken(req, res, next) {
 const authHeader = req.headers['authorization']
 const token = authHeader && authHeader.split(' ').at(1)
 if (!token) {
    return res.status(401).json({success: false, message: 'No token provided' })
 }
    try {
const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key')
const user = await userSchemaMDB.findById(decoded.id)
if (!user) {
    return res.status(401).json({success: false, message: 'User not found' })
}
req.user = {
    id: user.id,
    email: user.email,
    username: user.username
}
next()
    }
    catch (error) {
        return res.status(403).json({success: false, message: 'Invalid or expired token' })
    }
}

module.exports = { authenticateToken }