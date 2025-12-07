import express from 'express';
import pg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;
const app = express();

app.use(cors());
app.use(express.json());

// Database Connection
const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'gidroatlas',
    password: process.env.DB_PASSWORD || 'root',
    port: parseInt(process.env.DB_PORT || '5432'),
});

// Test DB Connection
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Database connected successfully');
    release();
});

// GET: All Water Objects
app.get('/api/water-objects', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM water_objects');

        // Map DB fields to Frontend types
        const mappedRows = result.rows.map(row => ({
            id: row.id,
            name: row.name,
            region: row.region,
            resourceType: row.resource_type,
            waterType: row.water_type,
            fauna: row.fauna,
            conditionCategory: row.technical_condition,
            passportDate: row.passport_date,
            latitude: row.latitude,
            longitude: row.longitude,
            passportUrl: row.pdf_url,
            description: row.description,
            area: row.area_ha,
            depth: row.depth_m
        }));

        res.json(mappedRows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
