import { UserController } from 'controllers/user.controller';
import express from 'express';
import Container from 'typedi';

const router = express.Router();
const controller = Container.get(UserController);

router.post('/register', controller.register);
router.post('/login', controller.login);

export default router;
