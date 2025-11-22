import { Request, Response } from 'express';
import db from '../db/knex';
import { logger } from '../lib/logger';

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Name is required' });
        }

        const [product] = await db('products').insert({ name }).returning('*');
        res.status(201).json(product);
    } catch (error) {
        logger.log(logger.LOG_LEVELS.ERROR, `An error occurred while creating product: ${error}`);
        res.status(500).json({ error: 'Failed to create product' });
    }
};

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await db('products').select('*');
        res.json(products);
    } catch (error) {
        logger.log(logger.LOG_LEVELS.ERROR, `An error occurred while fetching products: ${error}`);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
};
