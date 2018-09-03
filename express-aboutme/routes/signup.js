const express = require('express')
const router = express.Router()
const passport = require('passport')
const UserModel = require('../models/users')
// const checkNotLogin = require('../middleware/check').checkNotLogin

// GET /signup 注册页
router.get('/signup', (req, res) => {
	res.render('signup')
})
// POST /signup 用户注册
router.post(
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
			// req.session.user = createUser
			createUser.save(next)
		})
		// let user = { username, password, nickname, bio }
		// // 用户信息写入数据库
		// UserModel.create(user)
		// 	.then((result) => {
		// 		// 此 user 是插入 mongodb 后的值，包含 _id
		// 		user = result.ops[0]
		// 		deconste user.password
		// 		req.session.user = user
		// 		req.flash('success', '注册成功')
		// 		res.redirect('/')
		// 	})
		// 	.catch((err) => {
		// 		// 用户名被占用则跳回注册页，而不是错误页
		// 		if (err.message.match('E11000 duplicate key')) {
		// 			req.flash('error', '用户名已被占用')
		// 			return res.redirect('/signup')
		// 		}
		// 		next(err)
		// 	})
	},
	passport.authenticate('login', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true,
	})
)

// GET /login 登录页
router.get('/login', function(req, res) {
	res.render('login')
})
// POST /login 用户登录
router.post(
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
router.get('/logout', function(req, res) {
	req.logout()
	res.redirect('/')
})

module.exports = router
