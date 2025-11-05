import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

export async function MemberForm({ invite }: { invite: any }) {
  async function submit(formData: FormData) {
    'use server';

    const phone = formData.get('phone') as string;
    const company = (formData.get('company') as string) || invite.intention.company;
    const role = formData.get('role') as string;

    if (!invite.intentionId) {
      console.error('ERRO: intentionId ausente:', invite);
      return { error: 'ID da intenção não encontrado.' };
    }

    try {
      await prisma.member.create({
        data: {
          name: invite.intention.name,
          email: invite.intention.email,
          phone,
          company,
          role,
          intentionId: invite.intentionId,
        },
      });

      await prisma.invitation.update({
        where: { id: invite.id },
        data: { used: true },
      });

      console.log('Membro criado com sucesso! Redirecionando...');
      redirect('/invite/success'); // ← Isso já encerra a ação
    } catch (error: any) {
      console.error('ERRO NO BANCO:', error.message);
      // NÃO LANÇAR ERRO AQUI — redirect já trata
      return { error: 'Falha ao completar cadastro.' };
    }
  }

  return (
    <form action={submit} className="space-y-4">
      <input name="phone" placeholder="Telefone" required className="w-full p-3 border rounded" />
      <input name="company" placeholder="Empresa" defaultValue={invite.intention.company || ''} className="w-full p-3 border rounded" />
      <input name="role" placeholder="Cargo" required className="w-full p-3 border rounded" />
      <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">
        Finalizar Cadastro
      </button>
    </form>
  );
}
