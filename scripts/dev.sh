#! /bin/bash
sleep 10

pnpm prisma migrate dev
exec pnpm dev