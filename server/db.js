require("dotenv").config();

const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL is not configured.");
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL
        ? { rejectUnauthorized: false }
        : false
});

module.exports = pool;
