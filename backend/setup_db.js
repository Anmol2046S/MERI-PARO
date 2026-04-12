const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setup() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      multipleStatements: true
    });

    console.log('Connected to MySQL server.');

    await connection.query(`CREATE DATABASE IF NOT EXISTS meri_paro;`);
    console.log('Database meri_paro created or already exists.');

    await connection.query(`USE meri_paro;`);

    const schemaPath = path.join(__dirname, 'database', 'schema.sql');
    const seedPath = path.join(__dirname, 'database', 'seed.sql');

    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await connection.query(schemaSql);
      console.log('Schema imported successfully.');
    } else {
        console.log('Schema file not found:', schemaPath);
    }

    if (fs.existsSync(seedPath)) {
      const seedSql = fs.readFileSync(seedPath, 'utf8');
      await connection.query(seedSql);
      console.log('Seed imported successfully.');
    } else {
        console.log('Seed file not found:', seedPath);
    }

    await connection.end();
    console.log('Done.');
  } catch (err) {
    console.error('Error during setup:', err);
  }
}

setup();
