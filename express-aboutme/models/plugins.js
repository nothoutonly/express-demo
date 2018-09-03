const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
module.exports = exports = {
	addCreatedAt: function addCreatedAt(schema) {
		schema.post('find', function(results) {
			results.forEach((item) => {
				item.created_at = moment(objectIdToTimestamp(item._id)).format(
					'YYYY-MM-DD HH:mm'
				)
			})
		})
		schema.post('findOne', function(result) {
			if (result) {
				result.created_at = moment(objectIdToTimestamp(result._id)).format(
					'YYYY-MM-DD HH:mm'
				)
			}
			return result
		})
	},
}
