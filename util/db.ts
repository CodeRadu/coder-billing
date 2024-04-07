import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient().$extends({
  query: {
    user: {
      $allOperations({ operation, args, query }) {
        if ((operation === 'create' || operation === 'update') && args.data.password) {
          args.data.password = bcrypt.hashSync(args.data.password as string, 10);
        }
        if (operation === 'findUnique' && args.where.password) {
          args.where.password = bcrypt.hashSync(args.where.password as string, 10);
        }
        return query(args);
      }
    }
  }
})

export const getPrisma = () => prisma;