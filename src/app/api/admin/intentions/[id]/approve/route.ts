import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // Verifica admin
  if (process.env.ADMIN_KEY !== 'supersecret123') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ESPERA O PARAMS (Next.js 15)
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ error: 'ID da intenção não fornecido' }, { status: 400 });
  }

  try {
    // Atualiza intenção
    await prisma.intention.update({
      where: { id },
      data: { status: 'approved' },
    });

    // Gera convite
    const token = randomUUID().replace(/-/g, '').slice(0, 32);
    await prisma.invitation.create({
      data: {
        intentionId: id,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const link = `${process.env.NEXT_PUBLIC_URL}/invite/${token}`;
    console.log('Convite gerado:', link);

    return NextResponse.json({ link, token });
  } catch (error: any) {
    console.error('Erro:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
