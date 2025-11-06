// src/app/admin/page.tsx
import { IntentionList } from '@/components/admin/IntentionList';

// Chave que deve estar no seu arquivo .env.local
const ADMIN_KEY_VALUE = process.env.ADMIN_KEY; 

export default function AdminPage() {
  
  // Para este teste, vamos apenas verificar se a variável foi configurada no servidor
  if (!ADMIN_KEY_VALUE || ADMIN_KEY_VALUE !== 'supersecret123') {
    // Retorna a tela de acesso negado se a chave não estiver configurada corretamente
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        background: '#ffebee',
        fontFamily: 'Arial, sans-serif',
      }}>
        <div style={{
          textAlign: 'center',
          padding: '2rem',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          maxWidth: '500px',
          width: '100%',
        }}>
          <h2 style={{ color: '#d32f2f', fontSize: '1.8rem', marginBottom: '1rem' }}>
            Acesso Negado (401)
          </h2>
          <p style={{ color: '#555', fontSize: '1.1rem' }}>
            A chave de administração no ambiente não está configurada corretamente.
          </p>
        </div>
      </div>
    );
  }

  // Se a chave for a correta (para o teste)
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      background: '#f8fafc',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '900px',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 12px 32px rgba(0,0,0,0.08)',
        padding: '2.5rem',
      }}>
        <h1 style={{
          fontSize: '2.2rem',
          fontWeight: 'bold',
          color: '#1e293b',
          textAlign: 'center',
          marginBottom: '2rem',
          letterSpacing: '-0.5px',
        }}>
          Admin – Intenções Pendentes
        </h1>
        <IntentionList />
      </div>
    </div>
  );
}