'use client';
import { useEffect, useState } from 'react';

interface Intention {
  id: string;
  name: string;
  email: string;
  company?: string;
  status: string;
}

export function IntentionList() {
  const [intentions, setIntentions] = useState<Intention[]>([]);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/intentions')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        setIntentions(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const approve = async (id: string) => {
    if (approving || !id) return;
    setApproving(id);

    try {
      const res = await fetch(`/api/admin/intentions/${id}/approve`, {
        method: 'POST',
      });

      if (res.ok) {
        const { link } = await res.json();
        alert(`Convite gerado!\n\nLink: ${link}\n\nCopie e envie ao candidato.`);
        setIntentions(prev =>
          prev.map(i => (i.id === id ? { ...i, status: 'approved' } : i))
        );
      } else {
        const err = await res.text();
        alert('Erro ao aprovar:\n' + err);
      }
    } catch (err) {
        alert('Erro de rede. Verifique o console.');
    } finally {
      setApproving(null);
    }
  };

  if (loading) return <p className="text-gray-600">Carregando intenções...</p>;

  return (
    <div className="space-y-4">
      {intentions.length === 0 ? (
        <p className="text-gray-500 italic">Nenhuma intenção pendente.</p>
      ) : (
        intentions.map(i => (
          <div
            key={i.id}
            className="border border-gray-300 p-5 rounded-lg bg-white shadow-sm flex justify-between items-center"
          >
            <div>
              <strong className="text-lg">{i.name}</strong>{' '}
              <span className="text-sm text-gray-600">({i.email})</span>
              <br />
              {i.company && (
                <span className="text-sm text-gray-500 italic">{i.company}</span>
              )}
            </div>
            <div>
              {i.status === 'pending' ? (
                <button
                  onClick={() => approve(i.id)}
                  disabled={approving === i.id}
                  type="button"
                  className={`
                    px-5 py-2 rounded font-medium text-white transition-all
                    ${approving === i.id
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 active:bg-green-800 shadow-md'
                    }
                  `}
                >
                  {approving === i.id ? 'Aprovando...' : 'Aprovar'}
                </button>
              ) : (
                <span className="text-green-600 font-semibold">Aprovado</span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
