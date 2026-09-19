const path = require('path')
const express = require('express')

const authRouter = require('./routers/auth')
const profileRouter = require('./routers/profile')
const servicesRouter = require('./routers/service.js')
const barbersRouter = require('./routers/barber.js')
const appointmentsRouter = require('./routers/appointment.js')
const portfoliosRouter = require('./routers/portfolio.js')
const commentsRouter = require('./routers/comment.js')

const { setHeaders } = require('./middlewares/headers')
const { errorHandler } = require('./middlewares/errorhandler')

const app = express()

app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(express.json({ limit: '30mb'}))

app.use(setHeaders)

app.use(express.static(path.join(__dirname, "public")))

app.use('/v1/auth', authRouter)
app.use('/v1/profile', profileRouter)
app.use('/v1/services', servicesRouter)
app.use('/v1/barbers', barbersRouter)
app.use('/v1/appointments', appointmentsRouter)
app.use('/v1/protfolios', portfoliosRouter)
app.use('/v1/comments', commentsRouter)

app.use((req, res) => {
  console.log("This path is not found: ", req.path);

  return res.status(404).json({
    message: "404! Path Not Found. Please double check tha path / method",
  });
});

app.use(errorHandler)

module.exports = app;