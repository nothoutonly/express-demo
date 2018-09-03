const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const bodyParser = require('body-parser')
const session = require('express-session')
const flash = require('connect-flash')
const mongoose = require('mongoose')
const MongoStore = require('connect-mongo')(session)
const passport = require('passport')
const setUpPassport = require('./setuppassport')
const config = require('./config/default')

const routes = require('./routes')

const app = express()

// connect MongoDB
mongoose.Promise = global.Promise
const options = {
	auto_reconnect: true,
	poolSize: 10,
	useNewUrlParser: true,
}
mongoose.connect(
	config.mongodb,
	options
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
app.use(
	session({
		name: config.session.key, //设置 cookie 中保存 session id 的字段名称
		secret: config.session.secret, // 通过设置 secret 来计算 hash 值并放在 cookie中，使产生的 signedCookie 防篡改
		resave: true,
		saveUninitialized: true,
		cookie: {
			maxAge: config.session.maxAge, // 过期时间，过期后 cookie 中的 session id 自动删除
		},
		store: new MongoStore({
			// 将 session 存储到 mongodb
			url: config.mongodb,
		}),
	})
)
// passport 中间件，用来登录验证
app.use(passport.initialize())
app.use(passport.session())
// flash 中间价，用来显示通知
app.use(flash())

// // 处理表单及文件上传的中间件
// app.use(
// 	require('express-formidable')({
// 		uploadDir: path.join(__dirname, 'public/image'), // 上传文件目录
// 		keepExtensions: true, // 保留后缀
// 	})
// )
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
	// res.render('error')
})

module.exports = app
