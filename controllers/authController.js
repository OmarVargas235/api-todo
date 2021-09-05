const User = require('../models/user');
const bcrypt = require('bcrypt');
const { generarJWT } = require('../helper/jwt');

module.exports.loginUser = async (req, res) => {

	const { email, password } = req.body;
	
	try {

		const userBD = await User.findOne({ email });

		// Comprobando si el usuario existe
		if (userBD) {

			// Validar el password
			const validatePassword = await bcrypt.compare(password, userBD.password);

			if (validatePassword) {
				
				// Generera token
				const token = await generarJWT({id: userBD['_id'], name: userBD.name, email: userBD.email, lastName: userBD.lastName});
				
				// Guarda el token generado en la base de datos
				userBD.tokenAuth = token;
				await userBD.save();

				res.status(200).json({
					ok: true,
					token,
					messages: ['Ah iniciado sesion correctamente'],
				});

			} else {

				res.status(404).json({
					ok: false,
					messages: ['La contraseña es incorrecta'],
				});
			}

		} else {

			res.status(404).json({
				ok: false,
				messages: ['Este usuario no existe'],
			});
		}

	} catch(err) {
		
		console.log('loginUser', err);

		res.status(500).json({
            ok: false,
            messages: ['A ocurrido un error']
        });
	}
}

// =====================================
// Cerrar sesion
// =====================================
module.exports.logoutUser = async (req, res) => {

	try {
		
		const { token } = req.body;
		const userBD = await User.findOne({ tokenAuth: token });

		userBD.tokenAuth = '';
		await userBD.save();

		return res.status(200).json({
			ok: true,
			messages: ['Se a cerrado sesion correctamente'],
		});

	} catch(err) {

		console.log('logoutUser', err);
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}