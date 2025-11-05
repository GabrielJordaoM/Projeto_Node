import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { IntentionForm } from '@/components/forms/IntentionForm';

// Mock do fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: '123', status: 'pending' }),
  } as Response)
);

describe('IntentionForm', () => {
  it('envia formulário com sucesso', async () => {
    render(<IntentionForm />);

    fireEvent.change(screen.getByPlaceholderText('Nome'), { target: { value: 'João' } });
    fireEvent.change(screen.getByPlaceholderText('E-mail'), { target: { value: 'joao@teste.com' } });
    fireEvent.click(screen.getByText('Enviar Intenção'));

    await waitFor(() => {
      expect(screen.getByText('Intenção enviada com sucesso!')).toBeInTheDocument();
    });
  });
});
