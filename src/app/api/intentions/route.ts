// src/app/api/intentions/route.ts
import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function GET() {
  try {
    const intentions = await prisma.intention.findMany({
      where: { invitation: null }, // Apenas intenções não aprovadas
    });
    return Response.json(intentions);
  } catch (error) {
    console.error('Erro ao buscar intenções:', error);
    return Response.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const company = formData.get('company') as string;

    if (!name || !email || !company) {
      return Response.json(
        { error: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      );
    }

    const intention = await prisma.intention.create({
      data: { name, email, company },
    });

    return Response.json({ success: true, id: intention.id });
  } catch (error: any) {
    console.error('Erro ao criar intenção:', error);
    return Response.json(
      { error: error.message || 'Erro interno.' },
      { status: 500 }
    );
  }
}