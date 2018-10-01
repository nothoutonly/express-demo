let createError = require('http-errors')
let express = require('express')
let path = require('path')
let cookieParser = require('cookie-parser')
let logger = require('morgan')
let bodyParser = require('body-parser')
let session = require('express-session')
let flash = require('connect-flash')
let mongoose = require('mongoose')
let passport = require('passport')
let setUpPassport = require('./setuppassport')
let config = require('./config/default')

let routes = require('./routes')

let app = express()

// connect MongoDB
mongoose.Promise = global.Promise
mongoose.connect(
	config.mongodb,
	{
		useNewUrlParser: true,
	}
)
setUpPassport()
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(session(config.session))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// 添加模板必须的三个变量
app.use(function(req, res, next) {
	res.locals.currentUser = req.user
	res.locals.infos = req.flash('info')
	res.locals.errors = req.flash('error')
	next()
})

routes(app)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message
	res.locals.error = req.app.get('env') === 'development' ? err : {}

	// render the error page
	res.status(err.status || 500)
	res.render('error')
})

module.exports = app
