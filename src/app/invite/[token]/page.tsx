import { prisma } from '@/lib/db';
import { MemberForm } from '@/components/forms/MemberForm';

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: PageProps) {
  const { token } = await params;

  if (!token) {
    return <div className="p-8 text-red-600">Token inválido.</div>;
  }

  const invite = await prisma.invitation.findUnique({
    where: { token, used: false },
    select: {
      id: true,
      intentionId: true,     // OBRIGATÓRIO
      expiresAt: true,
      intention: {
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
        },
      },
    },
  });

  if (!invite || !invite.intentionId || new Date() > invite.expiresAt) {
    return <div className="p-8 text-red-600">Convite inválido ou expirado.</div>;
  }

  console.log('Convite válido:', {
    id: invite.id,
    intentionId: invite.intentionId,
    name: invite.intention.name,
  });

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-4">Complete seu cadastro, {invite.intention.name}!</h1>
      <MemberForm invite={invite} />
    </div>
  );
}
