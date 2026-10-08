import { useState } from 'react';
import { screen, waitFor } from '@testing-library/react';
import { Button } from '../Button';
import { Dialog } from './Dialog';
import { expectNoA11yViolations, setup } from '../../test-utils';

function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open settings</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Header>
          <Dialog.Title>Settings</Dialog.Title>
          <Dialog.Description>Change how the workspace behaves.</Dialog.Description>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body>
          <input aria-label="Workspace name" />
        </Dialog.Body>
        <Dialog.Footer>
          <Button onClick={() => setOpen(false)}>Done</Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}

async function openDialog() {
  const utils = setup(<Demo />);
  await utils.user.click(screen.getByRole('button', { name: 'Open settings' }));
  await screen.findByRole('dialog');
  return utils;
}

describe('Dialog', () => {
  it('is a labelled, described modal', async () => {
    await openDialog();
    const dialog = screen.getByRole('dialog', { name: 'Settings' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('Change how the workspace behaves.');
  });

  it('moves focus inside and keeps Tab within the dialog', async () => {
    const { user } = await openDialog();
    const dialog = screen.getByRole('dialog');
    await waitFor(() => expect(dialog).toContainElement(document.activeElement as HTMLElement));

    for (let i = 0; i < 6; i += 1) {
      await user.tab();
      expect(dialog).toContainElement(document.activeElement as HTMLElement);
    }
    await user.tab({ shift: true });
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it('closes on Escape and returns focus to the trigger', async () => {
    const { user } = await openDialog();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Open settings' })).toHaveFocus();
  });

  it('closes from the close button', async () => {
    const { user } = await openDialog();
    await user.click(screen.getByRole('button', { name: 'Close dialog' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes when the backdrop is clicked', async () => {
    const { user } = await openDialog();
    await user.click(screen.getByTestId('dialog-overlay'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('makes the page behind it inert', async () => {
    await openDialog();
    expect(
      screen.getByRole('button', { name: 'Open settings', hidden: true }).closest('[inert]'),
    ).not.toBeNull();
  });

  it('has no axe violations', async () => {
    await openDialog();
    await expectNoA11yViolations(screen.getByRole('dialog'));
  });
});
