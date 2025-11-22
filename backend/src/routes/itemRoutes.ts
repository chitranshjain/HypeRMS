import { Router } from 'express';
import { createReleaseItem, updateReleaseItem, updateReleaseItemStatus, getReleaseItems, getReleaseItem, getReleaseData } from '../controllers/itemController';

const router = Router();

router.post('/releases/:releaseId/items', createReleaseItem);
router.get('/releases/:id', getReleaseData);
router.get('/releases/:releaseId/items', getReleaseItems);
router.get('/items/:id', getReleaseItem);
router.patch('/items/:id', updateReleaseItem);
router.patch('/items/:id/status', updateReleaseItemStatus);

export default router;
