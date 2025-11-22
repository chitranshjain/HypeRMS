import { Request, Response } from 'express';
import db from '../db/knex';

export const addPrerequisite = async (req: Request, res: Response) => {
    try {
        const { itemId } = req.params;
        const { title, category } = req.body;

        if (!title || !category) {
            return res.status(400).json({ error: 'Title and category are required' });
        }

        const [prereq] = await db('prerequisites').insert({
            release_item_id: itemId,
            title,
            category,
            status: 'PENDING'
        }).returning('*');

        res.status(201).json(prereq);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add prerequisite' });
    }
};

export const updatePrerequisiteStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['PENDING', 'DONE'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const [prereq] = await db('prerequisites')
            .where({ id })
            .update({ status })
            .returning('*');

        if (!prereq) {
            return res.status(404).json({ error: 'Prerequisite not found' });
        }

        res.json(prereq);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update prerequisite status' });
    }
};
