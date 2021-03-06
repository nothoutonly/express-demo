const express = require('express')
const router = express.Router()
const UserModel = require('../models/users')

/* GET users listing. */
router.get('/:username', function(req, res, next) {
	UserModel.findOne({ username: req.params.username }, (err, user) => {
		if (err) {
			return next(err)
		}
		if (!user) {
			return next(404)
		}
		res.render('profile', { user })
	})
})

module.exports = router
