import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

dotenv.config();

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
};

async function initDb() {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        console.log('Connected to MySQL server.');

        // Create Database
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
        console.log(`Database ${process.env.DB_NAME} created or already exists.`);

        // Use Database
        await connection.changeUser({ database: process.env.DB_NAME });

        // Create Users Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('Users table ready.');

        // Create Services Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        duration INT NOT NULL, -- in minutes
        price DECIMAL(10, 2) NOT NULL,
        image VARCHAR(512),
        rating DECIMAL(3, 2) DEFAULT 0.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('Services table ready.');

        // Create Bookings Table
        await connection.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        service_id INT NOT NULL,
        booking_date DATE NOT NULL,
        booking_time TIME NOT NULL,
        status ENUM('pending', 'confirmed', 'completed', 'cancelled') DEFAULT 'pending',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
      )
    `);
        console.log('Bookings table ready.');

        // Seed Services if empty
        const [rows]: any = await connection.query('SELECT count(*) as count FROM services');
        if (rows[0].count === 0) {
            const services = [
                ['Classic Haircut', 'A traditional haircut with scissors and clipper.', 45, 150000, 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=800', 4.8],
                ['Beard Trim', 'Professional beard shaping and trimming.', 30, 75000, 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800', 4.9],
                ['Hot Towel Shave', 'Relaxing hot towel shave with straight razor.', 60, 200000, 'https://images.unsplash.com/photo-1503951914875-befbb6491846?w=800', 5.0],
                ['Hair Color', 'Full hair coloring service.', 90, 350000, 'https://images.unsplash.com/photo-1634480484947-a88ce37229de?w=800', 4.7],
                ['Facial Treatment', 'Rejuvenating facial specifically for men.', 45, 120000, 'https://images.unsplash.com/photo-1600959907703-125bacdce894?w=800', 4.8]
            ];

            for (const service of services) {
                await connection.execute(
                    'INSERT INTO services (name, description, duration, price, image, rating) VALUES (?, ?, ?, ?, ?, ?)',
                    service
                );
            }
            console.log('Seeded services data.');
        }

    } catch (error) {
        console.error('Database initialization failed:', error);
    } finally {
        if (connection) await connection.end();
    }
}

initDb();
