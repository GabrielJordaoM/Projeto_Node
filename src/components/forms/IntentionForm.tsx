'use client';
import { useState } from 'react';

export function IntentionForm() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch('/api/intentions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const err = await res.text();
        setError('Erro: ' + err);
      }
    } catch (err) {
      setError('Erro de rede');
    }
  };

  if (success) {
    return <p className="text-green-600 font-semibold">Intenção enviada com sucesso!</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input name="name" placeholder="Nome" required className="w-full p-2 border rounded" />
      <input name="email" type="email" placeholder="E-mail" required className="w-full p-2 border rounded" />
      <input name="company" placeholder="Empresa" className="w-full p-2 border rounded" />
      <textarea name="reason" placeholder="Por que quer participar?" className="w-full p-2 border rounded" rows={4} />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
        Enviar Intenção
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
