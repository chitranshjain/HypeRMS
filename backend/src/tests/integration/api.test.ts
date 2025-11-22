import request from 'supertest';
import { expect } from 'chai';
import express from 'express';
import knex from 'knex';
import knexConfig from '../../../knexfile';
import cors from 'cors';
import productRoutes from '../../routes/productRoutes';
import releaseRoutes from '../../routes/releaseRoutes';
import itemRoutes from '../../routes/itemRoutes';
import prerequisiteRoutes from '../../routes/prerequisiteRoutes';

// Setup App
const app = express();
app.use(cors());
app.use(express.json());
app.use('/products', productRoutes);
app.use('/', releaseRoutes);
app.use('/', itemRoutes);
app.use('/', prerequisiteRoutes);

// Setup DB
const db = knex(knexConfig.test);

describe('Integration Tests', () => {
    before(async () => {
        // Run migrations
        await db.migrate.latest();
    });

    after(async () => {
        // Rollback and destroy
        await db.migrate.rollback();
        await db.destroy();
    });

    beforeEach(async () => {
        // Clear tables before each test
        await db('prerequisites').del();
        await db('release_items').del();
        await db('releases').del();
        await db('products').del();
    });

    it('should create a product', async () => {
        const res = await request(app)
            .post('/products')
            .send({ name: 'Integration Test Product' });

        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('id');
        expect(res.body.name).to.equal('Integration Test Product');
    });

    it('should create a release', async () => {
        // 1. Create Product
        const prodRes = await request(app).post('/products').send({ name: 'Prod' });
        const productId = prodRes.body.id;

        // 2. Create Release
        const res = await request(app)
            .post(`/products/${productId}/releases`)
            .send({ targetDate: '2025-01-01' });

        expect(res.status).to.equal(201);
        expect(res.body.product_id).to.equal(productId);
        expect(res.body.status).to.equal('PLANNED');
    });

    it('should create a release item with prerequisites', async () => {
        // Setup
        const prodRes = await request(app).post('/products').send({ name: 'Prod' });
        const releaseRes = await request(app).post(`/products/${prodRes.body.id}/releases`).send({ targetDate: '2025-01-01' });
        const releaseId = releaseRes.body.id;

        // Test
        const res = await request(app)
            .post(`/releases/${releaseId}/items`)
            .send({
                title: 'Feature X',
                type: 'FEATURE',
                description: 'Desc',
                prerequisites: [{ title: 'Pre 1', category: 'ENV_VAR' }]
            });

        expect(res.status).to.equal(201);
        expect(res.body.title).to.equal('Feature X');
        expect(res.body.prerequisites).to.have.lengthOf(1);
        expect(res.body.prerequisites[0].title).to.equal('Pre 1');
    });
});
