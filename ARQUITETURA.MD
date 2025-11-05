# Arquitetura da Plataforma de Networking

## 1. Diagrama (Mermaid)

```mermaid
graph TD
    A[Frontend - Next.js] -->|REST| B[API Routes]
    B --> C[(SQLite / PostgreSQL)]
    A --> D[Página Pública]
    A --> E[Área Admin]
    A --> F[Convite por Token]
    A --> G[Indicações]