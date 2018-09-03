'use strict'

/**
 * Module dependencies
 */
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const bcrypt = require('bcrypt-nodejs')
const SALT_FACTOR = 10

mongoose.plugin(require('./plugins').addCreatedAt)

/**
 * User Schema
 */
const userSchema = Schema(
	{
		username: { type: String, require: true, unique: true },
		password: { type: String, require: true },
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
const noop = () => {}
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
userSchema.methods.normalizeDate = function(_id) {
	return moment(objectIdToTimestamp(_id)).format('YYYY-MM-DD HH:mm')
}

module.exports = mongoose.model('User', userSchema)
