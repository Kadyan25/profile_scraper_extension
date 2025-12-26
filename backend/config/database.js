import { Sequelize } from 'sequelize';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DB_NAME = process.env.DB_NAME || 'profile_scraper';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 3306;

// Function to create database if it doesn't exist
async function createDatabaseIfNotExists() {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    console.log(`✅ Database '${DB_NAME}' is ready`);
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error creating database:', error.message);
    throw error;
  }
}

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

export const connectDatabase = async () => {
  try {
    await createDatabaseIfNotExists();
    await sequelize.authenticate();
    console.log('✅ MySQL connected successfully');
    await sequelize.sync({ alter: false });
    console.log('✅ Database tables synchronized');
    return sequelize;
  } catch (error) {
    console.error('❌ MySQL connection error:', error.message);
    console.error('Make sure MySQL is running and credentials are correct');
    process.exit(1);
  }
};

export default sequelize;
