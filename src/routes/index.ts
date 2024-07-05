import { Router } from 'express';
import { register, login, changePassword, validateRefreshToken, getDummyData } from '../controllers/controller';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

router.post('/register', register);
router.post('/change-password', authenticateJWT, changePassword);
router.post('/login', login);
router.post('/validate-refresh-token', validateRefreshToken);
router.get('/dummy-data', authenticateJWT,getDummyData);

export default router;
