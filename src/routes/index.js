import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../swagger.json';
import authRoutes from './auth';
import userRoutes from './user';
import ingredientRoutes from './ingredient';

const router = Router();
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/ingredient', ingredientRoutes);
router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerDocument));

export default router;
