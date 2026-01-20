import { Request, Response } from 'express';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

export const getServices = async (req: Request, res: Response) => {
    try {
        const [services] = await pool.query('SELECT * FROM services');
        res.json(services);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getServiceById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const [services] = await pool.query<RowDataPacket[]>('SELECT * FROM services WHERE id = ?', [id]);

        if (services.length === 0) {
            return res.status(404).json({ message: 'Service not found' });
        }

        res.json(services[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
