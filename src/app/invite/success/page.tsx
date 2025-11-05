export default function SuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Cadastro concluído com sucesso!
        </h1>
        <p className="text-lg text-gray-700">
          Você agora é um membro ativo do grupo. Bem-vindo!
        </p>
      </div>
    </div>
  );
}