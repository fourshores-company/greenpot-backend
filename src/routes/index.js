import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../../swagger.json';
import authRoutes from './auth';
import userRoutes from './user';

const router = Router();
router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/docs', swaggerUi.serve);
router.get('/docs', swaggerUi.setup(swaggerDocument));

export default router;
