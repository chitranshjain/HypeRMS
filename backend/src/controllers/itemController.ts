import { Request, Response } from 'express';
import db from '../db/knex';
import { sendReleaseNotification } from '../services/slackService';

export const createReleaseItem = async (req: Request, res: Response) => {
    try {
        const { releaseId } = req.params;
        const { title, description, type, jiraLink, docLink, prerequisites } = req.body;

        if (!title || !type) {
            return res.status(400).json({ error: 'Title and type are required' });
        }

        console.log({
            release_id: releaseId,
            title,
            description,
            type,
            jira_link: jiraLink,
            doc_link: docLink,
            status: 'DEV'
        });

        const result = await db.transaction(async (trx) => {
            const [item] = await trx('release_items').insert({
                release_id: releaseId,
                title,
                description,
                type,
                jira_link: jiraLink,
                doc_link: docLink,
                status: 'DEV'
            }).returning('*');

            if (prerequisites && Array.isArray(prerequisites)) {
                const prereqData = prerequisites.map((p: any) => ({
                    release_item_id: item.id,
                    title: p.title,
                    category: p.category,
                    status: 'PENDING'
                }));
                const createdPrereqs = await trx('prerequisites').insert(prereqData).returning('*');
                return { ...item, prerequisites: createdPrereqs };
            }

            return item;
        });

        res.status(201).json(result);
    } catch (error: any) {
        console.error(error?.message, error?.stack, error?.code);
        res.status(500).json({ error: 'Failed to create release item' });
    }
};

export const updateReleaseItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        delete updates.id;
        delete updates.release_id;
        delete updates.created_at;

        const [item] = await db('release_items')
            .where({ id })
            .update(updates)
            .returning('*');

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        res.json(item);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update release item' });
    }
};

export const updateReleaseItemStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['DEV', 'PRE_PROD', 'RELEASED'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const item = await db('release_items').where({ id }).first();
        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        if (status === 'RELEASED') {
            const pendingPrereqs = await db('prerequisites')
                .where({ release_item_id: id, status: 'PENDING' })
                .count('id as count')
                .first();

            if (pendingPrereqs && Number(pendingPrereqs.count) > 0) {
                return res.status(400).json({ error: 'Cannot release item with pending prerequisites' });
            }
        }

        const [updatedItem] = await db('release_items')
            .where({ id })
            .update({ status })
            .returning('*');

        // Check if all items in the release are RELEASED
        if (status === 'RELEASED') {
            const releaseId = item.release_id;
            const pendingItems = await db('release_items')
                .where({ release_id: releaseId })
                .whereNot({ status: 'RELEASED' })
                .count('id as count')
                .first();

            if (pendingItems && Number(pendingItems.count) === 0) {
                // All items released, mark release as RELEASED
                await db('releases')
                    .where({ id: releaseId })
                    .update({ status: 'RELEASED' });

                // Trigger Slack Notification
                await sendReleaseNotification(releaseId);
            }
        }

        res.json(updatedItem);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update item status' });
    }
};

export const getReleaseItems = async (req: Request, res: Response) => {
    try {
        const { releaseId } = req.params;
        const items = await db('release_items').where({ release_id: releaseId });
        res.json(items);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch release items' });
    }
};

export const getReleaseItem = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const item = await db('release_items').where({ id }).first();

        if (!item) {
            return res.status(404).json({ error: 'Item not found' });
        }

        const prerequisites = await db('prerequisites').where({ release_item_id: id });
        res.json({ ...item, prerequisites });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch item details' });
    }
};

export const getReleaseData = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const release = await db('releases').where({ id }).first();
        if (!release) {
            return res.status(404).json({ error: 'Release not found' });
        }
        const items = await db('release_items').where({ release_id: id });
        res.json({ ...release, items });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch release details' });
    }
};
