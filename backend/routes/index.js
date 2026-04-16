import express from 'express';
import { registerController, loginController, userController, productController, refreshController, dashboardController } from '../controllers/index.js';
import orderController from '../controllers/orderController.js';
import auth from '../middlewares/auth.js';
import admin from '../middlewares/admin.js';
 
const router = express.Router();

router.post('/register', registerController.register);
router.post('/login', loginController.login);
router.post('/logout', auth, loginController.logout);
router.post('/refresh', refreshController.refresh);
router.get('/me', auth, userController.me);
router.post('/products', auth, admin, productController.store);
router.put('/products/:id', auth, admin, productController.update);
router.delete('/products/:id', auth, admin, productController.delete);
router.get('/products/getall', productController.getAll);
router.get('/products/:id', productController.getSingle);
router.post('/orders/checkout', auth, orderController.checkout);
router.get('/orders/my', auth, orderController.getUserOrders);
router.get('/orders/users', auth, admin, orderController.getUsersWithOrderCount);
router.get('/orders/user/:id', auth, admin, orderController.getOrdersByUser);
router.patch('/orders/:id/status', auth, admin, orderController.updateOrderStatus);
router.post('/orders/:id/cancel', auth, admin, orderController.cancelOrder);
router.get('/orders', auth, admin, orderController.getAllOrders);
router.get('/dashboard', auth, admin, dashboardController.dashboard);

export default router;