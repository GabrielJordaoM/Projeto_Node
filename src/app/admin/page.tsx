import { IntentionList } from '@/components/admin/IntentionList';

export default function AdminPage() {
  if (process.env.ADMIN_KEY !== 'supersecret123') {
    return <div className="p-8"><p className="text-red-600">Acesso negado.</p></div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Admin – Intenções Pendentes</h1>
      <IntentionList />
    </div>
  );
}
