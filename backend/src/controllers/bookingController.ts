import { Response } from 'express';
import pool from '../config/database';
import { AuthRequest } from '../middleware/authMiddleware';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const createBooking = async (req: AuthRequest, res: Response) => {
    const { service_id, booking_date, booking_time, notes } = req.body;
    const user_id = req.user.id;

    if (!service_id || !booking_date || !booking_time) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    try {
        const [result] = await pool.query<ResultSetHeader>(
            'INSERT INTO bookings (user_id, service_id, booking_date, booking_time, notes) VALUES (?, ?, ?, ?, ?)',
            [user_id, service_id, booking_date, booking_time, notes]
        );

        res.status(201).json({ message: 'Booking created successfully', bookingId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMyBookings = async (req: AuthRequest, res: Response) => {
    const user_id = req.user.id;

    try {
        const [bookings] = await pool.query(`
      SELECT b.*, s.name as service_name, s.image as service_image 
      FROM bookings b 
      JOIN services s ON b.service_id = s.id 
      WHERE b.user_id = ? 
      ORDER BY b.booking_date DESC, b.booking_time DESC
    `, [user_id]);

        res.json(bookings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Optional: Update status (if needed for testing or admin)
export const updateBookingStatus = async (req: AuthRequest, res: Response) => {
    // Basic implementation for demonstration
    const { id } = req.params;
    const { status } = req.body;

    try {
        await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Booking status updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}
