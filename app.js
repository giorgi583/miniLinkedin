const express = require('express')
const app = express()
const port = 5700
const bodyParser = require('body-parser')
const jobsRouter = require('./routes/jobs.routes')
const authRouter = require('./routes/auth.route')
const connectDB = require('./utils/db').connectDB
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('./swagger/swagger.json')

connectDB()
app.use(bodyParser.json())
app.use('/v1/job', jobsRouter)
app.use('/v1/auth', authRouter)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));



app.get('/test', (req, res) => {
  res.send('works');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})
