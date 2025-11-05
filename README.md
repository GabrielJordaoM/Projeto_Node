# Plataforma de Networking

## Funcionalidades
- Formulário público de intenção
- Área admin (protegida por .env)
- Convite por token
- Cadastro completo
- Sistema de indicações

## Setup
```bash
cp .env.example .env
npm install
npx prisma migrate dev
npm run dev