'use client';

import { useRouter } from 'next/navigation';

export function MemberForm({ invite }: any) {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append('invitationId', invite.id);
    await fetch('/api/members', { method: 'POST', body: formData });
    router.push('/invite/success');
  };

  return (
    <form onSubmit={handleSubmit} style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
    }}>
      <input
        name="phone"
        placeholder="Telefone"
        required
        style={{
          height: '48px',
          padding: '0 1rem',
          fontSize: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      />
      <input
        name="position"
        placeholder="Cargo"
        required
        style={{
          height: '48px',
          padding: '0 1rem',
          fontSize: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
        }}
      />
      <button
        type="submit"
        style={{
          height: '48px',
          background: '#28a745',
          color: 'white',
          fontSize: '1rem',
          fontWeight: 'bold',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Finalizar Cadastro
      </button>
    </form>
  );
}