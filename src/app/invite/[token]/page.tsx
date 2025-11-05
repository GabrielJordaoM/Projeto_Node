import { prisma } from '@/lib/db';
import { MemberForm } from '@/components/forms/MemberForm';

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: PageProps) {
  const { token } = await params; // <-- AWAIT O PARAMS

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600">Token inválido</h1>
        </div>
      </div>
    );
  }

  const invite = await prisma.invitation.findUnique({
    where: { token, used: false },
    select: {
      id: true,
      intentionId: true,
      expiresAt: true,
      intention: {
        select: { id: true, name: true, email: true, company: true },
      },
    },
  });

  if (!invite || new Date() > invite.expiresAt) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-6">
        <div className="bg-white p-8 rounded-xl shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600">Convite inválido ou expirado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Complete seu cadastro, {invite.intention.name}!
        </h1>
        <MemberForm invite={invite} />
      </div>
    </div>
  );
}
