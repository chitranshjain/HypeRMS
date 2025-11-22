import { Router } from 'express';
import { createRelease, getReleases, updateReleaseStatus } from '../controllers/releaseController';

const router = Router();

router.post('/products/:productId/releases', createRelease);
router.get('/products/:productId/releases', getReleases);
router.patch('/releases/:id/status', updateReleaseStatus);

export default router;
