const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports.verifyToken = async (req, res, next) => {
	
	const { token } = req.body;
	const userBD = await User.findOne({ tokenAuth: token });

	try {
		
		const token = userBD.tokenAuth;

		// Verifica si el token esta vencido
		const isExpired = jwt.verify(token, process.env.SEED);
		req.url !== '/expired-token' && next();

	} catch(err) {

		res.status(404).json({
			ok: false,
			messages: ['El token ya a expirado'],
		});
	}
}