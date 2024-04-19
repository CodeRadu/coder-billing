#! /bin/bash
source .env.production.local
pnpm prisma migrate deploy
pnpm start