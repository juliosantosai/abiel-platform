// src/shared/database/prisma.test.js
const prisma = require('./prisma');

describe('Prisma Client Initialization', () => {
  test('prisma debería estar definido y tener el método $queryRaw', () => {
    expect(prisma).toBeDefined();
    // Verificamos que es la instancia correcta de PrismaClient
    expect(typeof prisma.$queryRaw).toBe('function');
  });

  test('debería poder realizar una consulta básica', async () => {
    // Esto asegura que la conexión está viva y responde
    const result = await prisma.$queryRaw`SELECT 1 as connected`;
    expect(result).toBeDefined();
    expect(result[0].connected).toBe(1);
  });
});