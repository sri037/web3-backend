import {Router} from 'express';
import {userAuthController} from '@controller/user/user.auth.controller';


export const userRoutes: Router = Router();
userRoutes.post('/login', userAuthController.signIn)
userRoutes.post('/signUp', userAuthController.signUp)
userRoutes.post('/authenticate', userAuthController.authenticate)
