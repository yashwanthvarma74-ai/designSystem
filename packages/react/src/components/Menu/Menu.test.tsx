import { screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Menu } from './Menu';
import { expectNoA11yViolations, setup } from '../../test-utils';

function Demo({
  onEdit = () => {},
  onDelete = () => {},
}: {
  onEdit?: () => void;
  onDelete?: () => void;
}) {
  return (
    <Menu>
      <Menu.Trigger>Actions</Menu.Trigger>
      <Menu.Content aria-label="Document actions">
        <Menu.Item id="edit" onAction={onEdit}>
          Edit
        </Menu.Item>
        <Menu.Item id="duplicate">Duplicate</Menu.Item>
        <Menu.Separator />
        <Menu.Item id="delete" danger onAction={onDelete}>
          Delete
        </Menu.Item>
      </Menu.Content>
    </Menu>
  );
}

describe('Menu', () => {
  it('opens from the trigger and lists menu items', async () => {
    const { user } = setup(<Demo />);
    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'true');
    await user.click(trigger);
    const menu = await screen.findByRole('menu', { name: 'Actions' });
    expect(menu).toBeInTheDocument();
    expect(screen.getAllByRole('menuitem')).toHaveLength(3);
  });

  it('opens with the keyboard and moves with arrow keys', async () => {
    const { user } = setup(<Demo />);
    await user.tab();
    await user.keyboard('{Enter}');
    await screen.findByRole('menu');
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
  });

  it('runs an item and closes the menu', async () => {
    const onEdit = vi.fn();
    const { user } = setup(<Demo onEdit={onEdit} />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Edit' }));
    expect(onEdit).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes with Escape and returns focus to the trigger', async () => {
    const { user } = setup(<Demo />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await screen.findByRole('menu');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus());
  });

  it('has no axe violations when open', async () => {
    const { user } = setup(<Demo />);
    await user.click(screen.getByRole('button', { name: 'Actions' }));
    await screen.findByRole('menu');
    await expectNoA11yViolations(document.body);
  });
});
