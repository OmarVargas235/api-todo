const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { 
	validateFormRegister,
	validateFormLogin,
} = require('../middleware/validations');

module.exports = () => {

	// Registro de usuarios
	// router.post('/create-user', validateFormRegister, userController.createUser);

	// Autenticar usuario
	// router.post('/login-user', validateFormLogin, authController.loginUser);

	// Cerrar sesion
	// router.post('/logout-user', authController.logoutUser);

	return router;
}