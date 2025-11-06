import { IntentionForm } from '@/components/forms/IntentionForm';

export default function IntentionPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      background: '#f7f9fc',
      fontFamily: 'Arial, sans-serif',
    }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <h1 style={{
          fontSize: '2rem',
          marginBottom: '2rem',
          color: '#1a1a1a',
          textAlign: 'center',
        }}>
          Formulário de Intenção
        </h1>
        <IntentionForm />
      </div>
    </div>
  );
}