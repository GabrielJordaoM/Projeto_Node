'use client';

import { useState, useRef } from 'react';

export function IntentionForm() {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSubmitted(false);

    const form = formRef.current;
    if (!form) return;

    const formData = new FormData(form);

    try {
      const res = await fetch('/api/intentions', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        setSubmitted(true);
        form.reset(); // Agora é 100% seguro
      } else {
        const text = await res.text();
        setError(text || 'Erro ao enviar. Tente novamente.');
      }
    } catch (err) {
      console.error('Erro de rede:', err);
      setError('Erro de conexão. Verifique sua internet.');
    }
  };

  return (
    <div>
      {submitted ? (
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: '#e8f5e9',
          borderRadius: '12px',
          border: '1px solid #a5d6a7',
          marginBottom: '1rem',
        }}>
          <h2 style={{ color: '#2e7d32', fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            Enviado com sucesso!
          </h2>
          <p style={{ color: '#1b5e20', fontSize: '1.1rem' }}>
            Sua intenção foi enviada ao administrador.
          </p>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}>
          <input name="name" placeholder="Nome" required style={{ height: '48px', padding: '0 1rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '8px' }} />
          <input name="email" type="email" placeholder="E-mail" required style={{ height: '48px', padding: '0 1rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '8px' }} />
          <input name="company" placeholder="Empresa" required style={{ height: '48px', padding: '0 1rem', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '8px' }} />
          <button type="submit" style={{ height: '48px', background: '#0070f3', color: 'white', fontSize: '1rem', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            Enviar Intenção
          </button>
        </form>
      )}

      {error && (
        <p style={{ color: '#d32f2f', textAlign: 'center', marginTop: '1rem' }}>
          {error}
        </p>
      )}
    </div>
  );
}