module.exports = {
	port: 3100,
	session: {
		secret: 'myblog',
		key: 'myblog',
		maxAge: 2592000000,
	},
	mongodb:
		'mongodb://androcles:seasilent960117@ds029224.mlab.com:29224/express-blog',
}
