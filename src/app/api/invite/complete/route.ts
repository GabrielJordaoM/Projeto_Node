import { prisma } from '@/lib/db';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const inviteId = formData.get('inviteId') as string;
  const phone = formData.get('phone') as string;
  const company = formData.get('company') as string;
  const role = formData.get('role') as string;

  try {
    const invite = await prisma.invitation.findUnique({
      where: { id: inviteId, used: false },
      include: { intention: true },
    });

    if (!invite || new Date() > invite.expiresAt) {
      return Response.json({ error: 'Convite inválido ou expirado.' }, { status: 400 });
    }

    await prisma.member.create({
      data: {
        name: invite.intention.name,
        email: invite.intention.email,
        phone,
        company,
        role,
        intentionId: invite.intentionId,
      },
    });

    await prisma.invitation.update({
      where: { id: inviteId },
      data: { used: true },
    });

    return Response.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao completar cadastro:', error);
    return Response.json({ error: 'Falha ao completar cadastro.' }, { status: 500 });
  }
}
