process.on('unhandledRejection', (reason) => {
  console.log('unhandledRejection', {
    code: reason.code,
    message: reason.message,
    stack: reason.stack
  })

  process.exit(0)
})

const mongoose = require('mongoose')
mongoose.Promise = Promise
mongoose.connect('mongodb://localhost/soundman', { useMongoClient: true })
const path = require('path')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const routes = require('./api/routes.js')
const auth = require('./routes/auth');
require('api/helpers/passport')

app.set('views', path.join(__dirname, '/public'))
app.engine('html', require('ejs').renderFile)

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// public data
app.use(express.static('public'))

// parse application/json
app.use(bodyParser.json())

app.use('/auth', auth);
Object.keys(routes).forEach(key => {
  app.use(key, passport.authenticate('jwt', {session: false}), routes[key])
})

app.listen(3000, () => {
  console.log('Started')
})
