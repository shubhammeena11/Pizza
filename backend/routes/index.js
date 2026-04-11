import express from 'express';
import {registerController, loginController, userController, productController, refreshController } from '../controllers/index.js';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';
 
const router = express.Router();

router.post('/register',registerController.register);
router.post('/login',loginController.login);
router.post('/logout',auth,loginController.logout);
router.post('/refresh',refreshController.refresh);
router.get('/me',auth,userController.me);
router.post('/products',auth,admin,productController.store);
router.put('/products/:id',auth,admin,productController.update);
router.delete('/products/:id',auth,admin,productController.delete);
router.get('/products/getALL', productController.getAll);
router.get('/products/:id', productController.getSingle);

export default router;