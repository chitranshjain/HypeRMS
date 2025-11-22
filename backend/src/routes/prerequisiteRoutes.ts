import { Router } from 'express';
import { addPrerequisite, updatePrerequisiteStatus } from '../controllers/prerequisiteController';

const router = Router();

router.post('/items/:itemId/prerequisites', addPrerequisite);
router.patch('/prerequisites/:id/status', updatePrerequisiteStatus);

export default router;
