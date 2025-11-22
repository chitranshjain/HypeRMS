import axios from 'axios';
import db from '../db/knex';

export const sendReleaseNotification = async (releaseId: string) => {
    try {
        const release = await db('releases').where({ id: releaseId }).first();
        const product = await db('products').where({ id: release.product_id }).first();
        const items = await db('release_items').where({ release_id: releaseId });

        const webhookUrl = process.env.SLACK_WEBHOOK_URL;

        if (!webhookUrl) {
            console.log('SLACK_WEBHOOK_URL not set. Skipping notification.');
            console.log(`[MOCK SLACK] Product: ${product.name}, Release Date: ${release.target_date}`);
            console.log(`[MOCK SLACK] Items:`, items.map((i: any) => i.title));
            return;
        }

        const groupedItems = items.reduce((acc: any, item: any) => {
            if (!acc[item.type]) acc[item.type] = [];
            acc[item.type].push(item);
            return acc;
        }, {});

        const blocks: any[] = [
            {
                type: "header",
                text: {
                    type: "plain_text",
                    text: `🚀 New Release: ${product.name}`,
                    emoji: true
                }
            },
            {
                type: "section",
                fields: [
                    {
                        type: "mrkdwn",
                        text: `*Release Date:*\n${new Date(release.target_date).toDateString()}`
                    }
                ]
            },
            {
                type: "divider"
            }
        ];

        for (const type in groupedItems) {
            blocks.push({
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: `*${type}*`
                }
            });

            const itemList = groupedItems[type].map((item: any) => `• *${item.title}*: ${item.description || 'No description'}`).join('\n');
            blocks.push({
                type: "section",
                text: {
                    type: "mrkdwn",
                    text: itemList
                }
            });
        }

        await axios.post(webhookUrl, { blocks });
        console.log(`Slack notification sent for release ${releaseId}`);
    } catch (error) {
        console.error('Failed to send Slack notification:', error);
    }
};
