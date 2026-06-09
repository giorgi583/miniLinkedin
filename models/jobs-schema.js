
const mongoose = require('mongoose')



const jobSchemaMDB = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    salaryMin: { type: Number, default: null },
    salaryMax: { type: Number, default: null },
    employmentType: { type: String, enum: ['Full-time', 'Part-time', 'Contract', 'Internship'], required: true },
    experienceLevel: { type: String, enum: ['junior', 'Middle', 'Senior', 'Lead'], required: true },
    availableTill: { type: Date, required: true }
})
const jobModel = mongoose.model('joblisting', jobSchemaMDB)

module.exports = {
    jobSchemaMDB: jobModel
}