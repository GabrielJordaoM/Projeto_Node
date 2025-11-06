import { prisma } from '@/lib/db';
import { MemberForm } from '@/components/forms/MemberForm';

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;

  const invite = await prisma.invitation.findUnique({
    where: { token, used: false },
    include: { intention: true },
  });

  if (!invite || new Date() > invite.expiresAt) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        background: '#ffebee',
      }}>
        <div style={{ textAlign: 'center', maxWidth: '500px' }}>
          <h2 style={{ color: '#d32f2f', fontSize: '1.8rem' }}>Convite Expirado</h2>
          <p>Este link não é mais válido.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      background: '#e8f5e9',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <h1 style={{
          fontSize: '1.8rem',
          marginBottom: '2rem',
          color: '#1a1a1a',
          textAlign: 'center',
        }}>
          Olá, {invite.intention.name}!
        </h1>
        <MemberForm invite={invite} />
      </div>
    </div>
  );
}