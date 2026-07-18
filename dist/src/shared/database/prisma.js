"use strict";
require('dotenv').config(); // <-- Añade esto al inicio
const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");
const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});
const adapter = new PrismaPg(pool);
// Aquí es donde le pasamos el adaptador con la URL,
// cumpliendo con la nueva normativa de Prisma 7
const prisma = new PrismaClient({ adapter });
prisma.disconnect = async () => {
    await prisma.$disconnect();
    await pool.end();
};
module.exports = prisma;
//# sourceMappingURL=prisma.js.map