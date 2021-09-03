const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	lastName: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
	},
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		trim: true,
	},
	activeAccount: Boolean,
	tokenAuth: String,
	tokenURL: String,
});

module.exports = mongoose.model('user', userSchema);