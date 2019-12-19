import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../swagger.json';
import authRoutes from './auth';
import userRoutes from './user';
import ingredientRoutes from './ingredient';
import mealRoutes from './meal';
import orderRoutes from './order';
import cartRoutes from './cart';
import paymentRoutes from './pay';

const router = Router();
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/ingredient', ingredientRoutes);
router.use('/meal', mealRoutes);
router.use('/order', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/pay', paymentRoutes);
router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerDocument));

export default router;
