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
  // aceita ADMIN_KEY ou (em demo) NEXT_PUBLIC_ADMIN_KEY
  const serverKey = process.env.ADMIN_KEY || process.env.NEXT_PUBLIC_ADMIN_KEY;

  // Debug leve para desenvolvimento (não imprime chaves)
  console.log('[ADMIN APPROVE] clientKey present:', !!clientKey, 'serverKey present:', !!serverKey, 'match:', clientKey === serverKey);

  // 2. Verifica a autorização:
  // (a) Se não há chave no cliente, (b) se a chave do cliente não bate com a chave do servidor, 
  // ou (c) se a chave não foi configurada no ambiente.
  if (!clientKey || clientKey !== serverKey || !serverKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = params; // Usando a sintaxe comum, já que 'params' não é Promise aqui
  // Alguns ambientes podem não popular `params` corretamente — tenta extrair do pathname como fallback
  let intentionId = id;
  if (!intentionId) {
    try {
      const pathname = request.nextUrl?.pathname || new URL(request.url).pathname;
      const m = pathname.match(/\/api\/admin\/intentions\/(.*?)\/approve/);
      if (m) intentionId = m[1];
    } catch (e) {
      // ignore
    }
  }

  console.log('[ADMIN APPROVE] request url:', request.url, 'params.id:', id, 'resolved id:', intentionId);

  if (!intentionId) {
    return NextResponse.json({ error: 'ID da intenção não fornecido' }, { status: 400 });
  }

  try {
    // Verifica se intenção existe e não foi aprovada
    const intention = await prisma.intention.findUnique({
      where: { id: intentionId },
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
        intentionId: intentionId,
        expiresAt,
      },
    });

    // Marca intenção como aprovada (atualiza status)
    await prisma.intention.update({
      where: { id: intentionId },
      data: { status: 'approved' },
    });

  // Gera link completo (rota existente em /invite/[token])
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  const inviteLink = `${baseUrl}/invite/${token}`;
    
    // Simulação do envio de e-mail (conforme pedido no teste)
    console.log(`[SIMULAÇÃO E-MAIL] Convite gerado para ${intention.email}: ${inviteLink}`);


    // Retorna sucesso e o link gerado (mantemos formas compatíveis com a UI antiga)
    return NextResponse.json({ 
      message: 'Intenção aprovada e convite gerado.', 
      inviteLink: inviteLink,
      // campos anteriores esperados pelo cliente
      link: inviteLink,
      token: token,
      invitationId: invitation.id,
    }, { status: 200 });

  } catch (error) {
    console.error('Erro ao aprovar intenção:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}