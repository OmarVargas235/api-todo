const User = require('../models/user');
const Notifications = require('../models/notifications');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const path = require('path');
const fs = require('fs');
const { sendEmail } = require('../config/mailer');
const { selectedSocialMedias } = require('../helper/user');
const { saveCloudinary, deleteCloudinary } = require('../helper/cloudinary');
let errorsMessageClient = {};

module.exports.createUser = async (req, res) => {
	
	const { email, password } = req.body;

	// verificar que el email no exista
    const existsEmail = await User.findOne({ email });
    
    if ( existsEmail ) {
        return res.status(400).json({
            ok: false,
            messages: ['El correo ya existe']
        });
    }

    // hash de la clave
	const userBD = new User(req.body);
	const hash = await bcrypt.hash(password, 12);
	userBD.password = hash;

	userBD.activeAccount = false;

	try {
		
		await userBD.save();

		res.status(200).json({
			ok: true,
			messages: ['Se a enviado un correo de confirmacion'],
		});

		// Enviando correo electronico de confirmacion
		const url = `http://${req.headers.host}/confirm-email/${email}`;

		sendEmail({
			email,
			subject: 'Mensaje de confirmacion de cuenta',
			resetUrl: url,
			changePassword: false,
			idUserBD: userBD['_id'],
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
		
		const token = req.header('x-token');
		const userBD = await User.findOne({ tokenAuth: token }, 'socialMedias name lastName email img recordsChat sales description role');

		const user = {...userBD['_doc']};
		const { _id:uid, ...rest } = user;
		rest.uid = uid;
			
		return res.status(200).json({
			ok: true,
			messages: rest,
		});

	} catch {
		
		return res.status(500).json({
			ok: false,
			messages: ['Ah ocurrido un error'],
		});
	}
}