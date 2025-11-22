import { Request, Response } from 'express';
import db from '../db/knex';

export const createRelease = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const { targetDate, name, description } = req.body;

        if (!targetDate || !name) {
            return res.status(400).json({ error: 'Target date and name are required' });
        }

        const [release] = await db('releases').insert({
            product_id: productId,
            target_date: targetDate,
            name,
            description,
            status: 'PLANNED'
        }).returning('*');

        res.status(201).json(release);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create release' });
    }
};

export const getReleases = async (req: Request, res: Response) => {
    try {
        const { productId } = req.params;
        const releases = await db('releases')
            .where({ product_id: productId })
            .orderBy('target_date', 'asc');

        const now = new Date();
        const upcoming = releases.filter((r: any) => r.status !== 'RELEASED');
        const historical = releases
            .filter((r: any) => r.status === 'RELEASED')
            .sort((a: any, b: any) => new Date(b.target_date).getTime() - new Date(a.target_date).getTime())
            .slice(0, 10);

        res.json({ upcoming, historical });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch releases' });
    }
};

export const updateReleaseStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['PLANNED', 'RELEASED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        // TODO: Add validation logic (check if all items are released)

        const [release] = await db('releases')
            .where({ id })
            .update({ status })
            .returning('*');

        if (!release) {
            return res.status(404).json({ error: 'Release not found' });
        }

        res.json(release);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update release status' });
    }
};
