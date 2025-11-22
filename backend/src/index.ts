import express from 'express';
import dotenv from 'dotenv';

import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

import productRoutes from './routes/productRoutes';
import releaseRoutes from './routes/releaseRoutes';
import itemRoutes from './routes/itemRoutes';
import prerequisiteRoutes from './routes/prerequisiteRoutes';
import requestLoggerMiddleware from './middleware/requestLogger';

app.use(cors());
app.use(express.json());

app.use(requestLoggerMiddleware);

app.use('/products', productRoutes);
app.use('/', releaseRoutes);
app.use('/', itemRoutes);
app.use('/', prerequisiteRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
