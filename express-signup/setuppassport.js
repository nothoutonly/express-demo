let passport = require('passport')
let UserModel = require('./models/users')
let LocalStrategy = require('passport-local').Strategy

passport.use(
	'login',
	new LocalStrategy(function(username, password, done) {
		UserModel.findOne({ username }, function(err, user) {
			if (!user) {
				return done(null, false, {
					message: 'No user has that username! Please sign up.',
				})
			}
			user.checkPassword(password, function(err, isMatch) {
				if (err) {
					return done(err)
				}
				if (isMatch) {
					return done(null, user)
				} else {
					return done(null, false, { message: 'Invalid password' })
				}
			})
		})
	})
)

module.exports = function() {
	passport.serializeUser(function(user, done) {
		done(null, user._id)
	})
	passport.deserializeUser(function(id, done) {
		UserModel.findById(id, function(err, user) {
			done(err, user)
		})
	})
}
