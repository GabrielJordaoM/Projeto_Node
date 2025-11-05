'use server';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function ReferralForm({ members }: { members: any[] }) {
  async function create(formData: FormData) {
    'use server';
    const data = Object.fromEntries(formData);
    await prisma.referral.create({ data });
    redirect('/referrals');
  }

  return (
    <form action={create} className="space-y-4 max-w-2xl">
      <select name="fromMemberId" required className="w-full p-2 border rounded">
        <option value="">De quem?</option>
        {members.map(m => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>
      <select name="toMemberId" required className="w-full p-2 border rounded">
        <option value="">Para quem?</option>
        {members.map(m => (
          <option key={m.id} value={m.id}>{m.name}</option>
        ))}
      </select>
      <input name="companyName" placeholder="Empresa Indicada" required className="w-full p-2 border rounded" />
      <input name="contactName" placeholder="Contato" className="w-full p-2 border rounded" />
      <textarea name="description" placeholder="Descrição" className="w-full p-2 border rounded" />
      <select name="status" className="w-full p-2 border rounded">
        <option value="new">Nova</option>
        <option value="in_contact">Em Contato</option>
        <option value="closed_won">Fechada</option>
      </select>
      <button type="submit" className="bg-green-600 text-white p-2 rounded w-full">
        Criar Indicação
      </button>
    </form>
  );
}