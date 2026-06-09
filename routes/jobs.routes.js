const express = require('express')
const jobsRouter = express.Router()
const { createJob, getJobById, getAllJobs, updateJob, deleteJob } = require('../services/job.services')
const { authenticateToken } = require('../middlewares/auth')

jobsRouter.post('/create', authenticateToken, createJob)
jobsRouter.get('/getOne/:id', authenticateToken, getJobById)
jobsRouter.get('/getAll', authenticateToken, getAllJobs)
jobsRouter.put('/update/:id', authenticateToken, updateJob)
jobsRouter.delete('/delete/:id', authenticateToken, deleteJob)
module.exports = jobsRouter