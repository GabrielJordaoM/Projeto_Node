'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function MemberForm({ invite }: { invite: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch('/api/invite/complete', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Erro ao cadastrar');

      router.push('/invite/success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input
        name="phone"
        placeholder="Telefone"
        required
        disabled={loading}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />
      <input
        name="company"
        placeholder="Empresa"
        defaultValue={invite.intention.company || ''}
        disabled={loading}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />
      <input
        name="role"
        placeholder="Cargo"
        required
        disabled={loading}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      />
      <input type="hidden" name="inviteId" value={invite.id} />

      {error && (
        <p className="text-red-600 text-sm bg-red-50 p-3 rounded-lg border border-red-200">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="30" />
              <path fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            Processando...
          </>
        ) : (
          'Finalizar Cadastro'
        )}
      </button>
    </form>
  );
}
