const User = require('../models/user');
const bcrypt = require('bcrypt');

module.exports.createUser = async (req, res) => {
	
	const { email, password } = req.body;

	// verificar que el email no exista
    const existsEmail = await User.findOne({ email });
    
    if ( existsEmail ) res.status(400).json({
        ok: false,
        messages: ['El correo ya existe']
    });

    // hash de la clave
	const userBD = new User(req.body);
	const hash = await bcrypt.hash(password, 12);
	userBD.password = hash;

	try {
		
		await userBD.save();

		res.status(200).json({
			ok: true,
			messages: ['Cuenta creada con exito'],
		});
	
	} catch (error) {
		
		console.log("registrar usuario", error);

		res.status(500).json({
			ok: false,
			messages: ['A ocurrido un error'],
		});
	}
}

// =====================================
// Obtener el usuario
// =====================================
module.exports.getUser = async (req, res) => {

	try {
		
		const { token } = req.body;
		const userBD = await User.findOne({ tokenAuth: token }, 'name lastName');
			
		return res.status(200).json({
			ok: true,
			messages: userBD,
		});

	} catch {
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}