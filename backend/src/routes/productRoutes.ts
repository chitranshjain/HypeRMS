import { Router } from 'express';
import { createProduct, getProducts } from '../controllers/productController';

const router = Router();

router.post('/', createProduct);
router.get('/', getProducts);

export default router;
