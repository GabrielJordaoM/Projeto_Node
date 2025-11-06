// src/app/api/intentions/[id]/approve/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { randomUUID } from 'crypto';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } } // Ajustado para a sintaxe comum do App Router
) {
  // 1. Obtém a chave do cabeçalho da requisição (o frontend deve enviá-la)
  const clientKey = request.headers.get('X-Admin-Key');
  const serverKey = process.env.ADMIN_KEY;

  // 2. Verifica a autorização:
  // (a) Se não há chave no cliente, (b) se a chave do cliente não bate com a chave do servidor, 
  // ou (c) se a chave não foi configurada no ambiente.
  if (!clientKey || clientKey !== serverKey || !serverKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params; // Usando a sintaxe comum, já que 'params' não é Promise aqui

  if (!id) {
    return NextResponse.json({ error: 'ID da intenção não fornecido' }, { status: 400 });
  }

  try {
    // Verifica se intenção existe e não foi aprovada
    const intention = await prisma.intention.findUnique({
      where: { id },
      include: { invitation: true },
    });

    if (!intention) {
      return NextResponse.json({ error: 'Intenção não encontrada' }, { status: 404 });
    }

    if (intention.invitation) {
      return NextResponse.json({ error: 'Intenção já aprovada' }, { status: 400 });
    }

    // Gera token
    const token = randomUUID().replace(/-/g, '').slice(0, 12);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 dias

    // Cria convite
    const invitation = await prisma.invitation.create({
      data: {
        token,
        intentionId: id,
        expiresAt,
      },
    });

    // Atualiza intenção com invitationId
    await prisma.intention.update({
      where: { id },
      data: { invitationId: invitation.id },
    });

    // Gera link completo
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    const inviteLink = `${baseUrl}/register/${token}`;
    
    // Simulação do envio de e-mail (conforme pedido no teste)
    console.log(`[SIMULAÇÃO E-MAIL] Convite gerado para ${intention.email}: ${inviteLink}`);


    // Retorna sucesso e o link gerado (opcionalmente)
    return NextResponse.json({ 
      message: 'Intenção aprovada e convite gerado.', 
      inviteLink: inviteLink 
    }, { status: 200 });

  } catch (error) {
    console.error('Erro ao aprovar intenção:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}