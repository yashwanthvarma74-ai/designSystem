import { act, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Button } from '../Button';
import { ToastProvider, useToast, type ToastOptions } from './Toast';
import { expectNoA11yViolations, setup } from '../../test-utils';

function Trigger(props: ToastOptions) {
  const { toast } = useToast();
  return <Button onClick={() => toast(props)}>Show toast</Button>;
}

function renderToast(props: ToastOptions) {
  return setup(
    <ToastProvider>
      <Trigger {...props} />
    </ToastProvider>,
  );
}

describe('Toast', () => {
  it('announces a message in a status region', async () => {
    const { user } = renderToast({ title: 'Saved', description: 'Your changes are live.' });
    await user.click(screen.getByRole('button', { name: 'Show toast' }));
    const message = await screen.findByRole('status');
    expect(message).toHaveTextContent('Saved');
    expect(message).toHaveTextContent('Your changes are live.');
  });

  it('uses the alert role for errors', async () => {
    const { user } = renderToast({ title: 'Upload failed', variant: 'danger' });
    await user.click(screen.getByRole('button', { name: 'Show toast' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Upload failed');
  });

  it('can be dismissed with the button', async () => {
    const { user } = renderToast({ title: 'Heads up', duration: 0 });
    await user.click(screen.getByRole('button', { name: 'Show toast' }));
    await user.click(await screen.findByRole('button', { name: 'Dismiss notification' }));
    expect(screen.queryByText('Heads up')).not.toBeInTheDocument();
  });

  it('runs the action and closes', async () => {
    const onUndo = vi.fn();
    const { user } = renderToast({
      title: 'Item deleted',
      duration: 0,
      action: { label: 'Undo', onClick: onUndo },
    });
    await user.click(screen.getByRole('button', { name: 'Show toast' }));
    await user.click(await screen.findByRole('button', { name: 'Undo' }));
    expect(onUndo).toHaveBeenCalledTimes(1);
    expect(screen.queryByText('Item deleted')).not.toBeInTheDocument();
  });

  it('goes away on its own after the duration', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      const { user } = renderToast({ title: 'Quick note', duration: 1000 });
      await user.click(screen.getByRole('button', { name: 'Show toast' }));
      expect(await screen.findByText('Quick note')).toBeInTheDocument();
      act(() => {
        vi.advanceTimersByTime(1200);
      });
      expect(screen.queryByText('Quick note')).not.toBeInTheDocument();
    } finally {
      vi.useRealTimers();
    }
  });

  it('has no axe violations', async () => {
    const { user } = renderToast({ title: 'Saved', variant: 'success', duration: 0 });
    await user.click(screen.getByRole('button', { name: 'Show toast' }));
    await screen.findByRole('status');
    await expectNoA11yViolations(document.body);
  });
});
