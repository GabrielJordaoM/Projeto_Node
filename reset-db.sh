#!/bin/bash
echo "Limpando banco de dados..."
rm -f dev.db
npx prisma db push --force-reset
npx prisma generate
echo "Banco limpo! Iniciando servidor..."
rm -rf .next
npm run dev
