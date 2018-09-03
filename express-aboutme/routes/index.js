const usersRouter = require('./users')
const signupRouter = require('./signup')
const passport = require('passport')
const UserModel = require('../models/users')

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
	// log in / log out / sign up
	app.use('/', signupRouter)
	// user profile
	app.use('/users', usersRouter)
	// edit
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
}
