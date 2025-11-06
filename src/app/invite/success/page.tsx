export default function SuccessPage() {
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
      <div style={{ textAlign: 'center', maxWidth: '500px' }}>
        <h1 style={{
          fontSize: '2.2rem',
          color: '#28a745',
          marginBottom: '1rem',
        }}>
          Cadastro concluído!
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#333' }}>
          Você agora é um membro ativo do grupo.
        </p>
      </div>
    </div>
  );
}