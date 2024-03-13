import express from 'express';
import Container from 'typedi';
import { AuthController } from '../controllers/auth.controller';
import { validateUser } from '../middleware/auth.middleware';

const router = express.Router();
const controller = Container.get(AuthController);

router.post('/register', controller.register);
router.post('/login', controller.login);
router.get('/verify', validateUser(), controller.verify);
router.post('/resend-verification', controller.resendVerification);
router.post('/verify', validateUser(), controller.verify);
router.post('/forgot-password', controller.forgotPassword);
router.post('/reset-password', validateUser(), controller.resetPassword);

export default router;
