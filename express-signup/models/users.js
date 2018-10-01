'use strict'

/**
 * Module dependencies
 */
let mongoose = require('mongoose')
let Schema = mongoose.Schema
let bcrypt = require('bcrypt-nodejs')
let SALT_FACTOR = 10

/**
 * User Schema
 */
let userSchema = Schema(
	{
		username: { type: String, require: true, unique: true },
		password: { type: String, require: true },
		createdAt: { type: Date, default: Date.now() },
		nickname: {
			type: String,
			default: Date.now()
				.toString()
				.slice(0, 8),
		},
		bio: { type: String, default: 'User no bio' },
		createTime: {
			type: Date,
			default: Date.now,
		},
		updateTime: {
			type: Date,
			default: Date.now,
		},
	},
	{
		versionKey: false,
		timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' },
	}
)

/**
 * pre-save hook
 */
let noop = () => {}
userSchema.pre('save', function(done) {
	let user = this

	if (!user.isModified('password')) {
		return done()
	}

	bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
		if (err) {
			return done(err)
		}
		bcrypt.hash(user.password, salt, noop, (err, hashedPassword) => {
			if (err) {
				return done(err)
			}
			user.password = hashedPassword
			done()
		})
	})
})

/**
 * Methods
 */
userSchema.methods.name = function() {
	return this.nickname || this.username
}

userSchema.methods.checkPassword = function(guess, done) {
	bcrypt.compare(guess, this.password, function(err, isMatch) {
		done(err, isMatch)
	})
}

module.exports = mongoose.model('User', userSchema)
