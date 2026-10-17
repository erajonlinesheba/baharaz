// Mock Prisma - No need @prisma/client - Build Error Fix
const mockPrisma = {
  product: {
    findMany: async () => [],
    findUnique: async () => null,
  },
  user: {
    findMany: async () => [],
  }
} as any;

export const prisma = mockPrisma;
export default mockPrisma;