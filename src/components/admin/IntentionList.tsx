'use client';

import { useEffect, useState } from 'react';

export function IntentionList() {
  const [intentions, setIntentions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchIntentions = async () => {
      try {
        const res = await fetch('/api/intentions');
        const text = await res.text(); // Lê como texto primeiro

        if (!res.ok) {
          throw new Error(text || 'Erro ao carregar intenções');
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          console.error('Erro ao parsear JSON:', parseError, 'Resposta:', text);
          throw new Error('Resposta inválida do servidor');
        }

        setIntentions(Array.isArray(data) ? data : []);
      } catch (err: any) {
        console.error('Erro ao carregar intenções:', err);
        setError(err.message);
        setIntentions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIntentions();
  }, []);

  const approve = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/intentions/${id}/approve`, {
        method: 'POST',
        headers: {
          'X-Admin-Key': process.env.NEXT_PUBLIC_ADMIN_KEY || '',
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Falha ao aprovar');
      }

      const data = await res.json();
      alert(`Convite gerado!\n\nLink: ${data.link}\nToken: ${data.token}`);
      setIntentions(prev => prev.filter((int: any) => int.id !== id));
    } catch (err: any) {
      alert(err.message || 'Erro ao aprovar. Tente novamente.');
    }
  };

  if (loading) {
    return <p style={{ textAlign: 'center', color: '#64748b' }}>Carregando...</p>;
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', color: '#dc2626' }}>
        <p>Erro: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {intentions.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#64748b',
          fontSize: '1.1rem',
          background: '#f1f5f9',
          borderRadius: '12px',
          border: '1px dashed #cbd5e1',
        }}>
          Nenhuma intenção pendente no momento.
        </div>
      ) : (
        intentions.map((int: any) => (
          <div
            key={int.id}
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '14px',
              padding: '1.5rem',
              background: '#ffffff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
            }}
          >
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#1e293b', margin: '0 0 0.5rem 0' }}>
                {int.name}
              </h3>
              <p style={{ margin: '0.3rem 0', color: '#475569' }}>
                <strong>E-mail:</strong> {int.email}
              </p>
              <p style={{ margin: '0.3rem 0', color: '#475569' }}>
                <strong>Empresa:</strong> {int.company}
              </p>
            </div>
            <button
              onClick={() => approve(int.id)}
              style={{
                width: '100%',
                height: '52px',
                background: '#10b981',
                color: 'white',
                fontSize: '1.1rem',
                fontWeight: 'bold',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
              }}
            >
              Aprovar e Gerar Convite
            </button>
          </div>
        ))
      )}
    </div>
  );
}