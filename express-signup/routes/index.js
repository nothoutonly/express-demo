let usersRouter = require('./users')
let passport = require('passport')
let UserModel = require('../models/users')

/**
 * 通用的中间件工具函数，对当前用户的权限进行检查
 */
function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) {
		next()
	} else {
		req.flash('info', 'You must be logged in to see this page')
		res.redirect('/login')
	}
}

module.exports = (app) => {
	// GET home page.
	app.get('/', function(req, res, next) {
		UserModel.find()
			.sort({ createdAt: '-1' })
			.exec(function(err, users) {
				if (err) {
					return next(err)
				}
				res.render('index', { users })
			})
	})

	// GET /signup 注册页
	app.get('/signup', (req, res) => {
		res.render('signup')
	})
	// POST /signup 用户注册
	app.post(
		'/signup',
		(req, res, next) => {
			let { username, password, nickname, bio } = req.body
			UserModel.findOne({ username }, (err, user) => {
				if (err) {
					return next(err)
				}
				if (user) {
					req.flash('error', 'User already exists')
					return res.redirect('/signup')
				}
				let createUser = new UserModel({ username, password, nickname, bio })
				createUser.save(next)
			})
		},
		passport.authenticate('login', {
			successRedirect: '/',
			failureRedirect: '/signup',
			failureFlash: true,
		})
	)

	// GET /login 登录页
	app.get('/login', function(req, res) {
		res.render('login')
	})
	// POST /login 用户登录
	app.post(
		'/login',
		passport.authenticate('login', {
			successRedirect: '/',
			failureRedirect: '/login',
			failureFlash: true,
			successFlash: 'Log in successful!',
		}),
		function(req, res) {
			res.redirect('/')
		}
	)

	// GET /logout 登出
	app.get('/logout', function(req, res) {
		req.logout()
		res.redirect('/')
	})

	app.get('/edit', ensureAuthenticated, function(req, res) {
		res.render('edit')
	})
	app.post('/edit', ensureAuthenticated, function(req, res, next) {
		req.user.nickname = req.body.nickname
		req.user.bio = req.body.bio
		req.user.save(function(err) {
			if (err) {
				return next(err)
			}
			req.flash('info', 'Profile updated')
			res.redirect('/edit')
		})
	})
	app.use('/users', usersRouter)
}
