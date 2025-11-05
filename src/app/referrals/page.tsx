import { ReferralForm } from '@/components/forms/ReferralForm';
import { prisma } from '@/lib/db';

export default async function ReferralsPage() {
  const members = await prisma.member.findMany({ where: { isActive: true } });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Minhas Indicações</h1>
      <ReferralForm members={members} />
    </div>
  );
}