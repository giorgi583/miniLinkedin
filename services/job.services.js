const { z } = require('zod');
const { jobSchemaMDB } = require('../models/jobs-schema');

const jobValidationSchema = z.object({
    title: z.string().min(3).max(150),
    description: z.string().min(10).max(1500),
    salaryMin: z.number().positive(),
    salaryMax: z.number().positive(),
    employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Internship']),
    experienceLevel: z.enum(['junior', 'Middle', 'Senior', 'Lead']),
    availableTill: z.number().int().positive().refine((timestamp) => {
        const now = Date.now();
        return timestamp > now;
    }, {
        message: 'deadline must be a future date in milliseconds'
    }).transform((timestamp) => new Date(timestamp)),
});
async function createJob(req, res) {
    const newJob = req.body;
    const validationResult = jobValidationSchema.safeParse(newJob);
    if (!validationResult.success) {
        return res.status(400).json({success: false, message: JSON.parse(validationResult.error.message)});
    }
    // Simulate job creation (e.g., save to database)
    const newJobOffer = await jobSchemaMDB.create(newJob);  
    if(!newJobOffer) {
        return res.status(500).json({success: false, message: 'Failed to create job offer'});
    }
    return res.status(201).json({success: true, message: 'Job offer created successfully!', data: newJobOffer});
}
async function getJobById(req, res) {
    const jobId = req.params.id;
    try {
        const job = await jobSchemaMDB.findById(jobId);
        if (!job) {
            return res.status(404).json({ success: false, message: 'Job offer not found' });
        }
        return res.status(200).json({ success: true, data: job });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
async function getAllJobs(req, res) {
    try {
        const jobs = await jobSchemaMDB.find();
        return res.status(200).json({ success: true, data: jobs });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
async function updateJob(req, res) {
    const jobId = req.params.id;
    const updatedData = req.body;
    const validationResult = jobValidationSchema.partial().safeParse(updatedData);
    if (!validationResult.success) {
        return res.status(400).json({ success: false, message: JSON.parse(validationResult.error.message) });
    }
    try {
        const updatedJob = await jobSchemaMDB.findByIdAndUpdate(jobId, updatedData, { new: true });
        if (!updatedJob) {
            return res.status(404).json({ success: false, message: 'Job offer not found' });
        }
        return res.status(200).json({ success: true, message: 'Job offer updated successfully', data: updatedJob });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
async function deleteJob(req, res) {
    const jobId = req.params.id;
    try {
        const deletedJob = await jobSchemaMDB.findByIdAndDelete(jobId);
        if (!deletedJob) {
            return res.status(404).json({ success: false, message: 'Job offer not found' });
        }
        return res.status(200).json({ success: true, message: 'Job offer deleted successfully' });
    } catch (error) {
        return res.status(500).json({ success: false, message: 'Internal server error' });
    }
}
module.exports = {
    createJob,
    getJobById,
    getAllJobs,
    updateJob,
    deleteJob
}
