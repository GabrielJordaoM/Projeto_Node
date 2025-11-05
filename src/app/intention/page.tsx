import { IntentionForm } from '@/components/forms/IntentionForm';

export default function IntentionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Formulário de Intenção
        </h1>
        <IntentionForm />
      </div>
    </div>
  );
}