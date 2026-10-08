import { screen } from '@testing-library/react';
import { Tabs } from './Tabs';
import { expectNoA11yViolations, setup } from '../../test-utils';

function Demo(props: { activation?: 'automatic' | 'manual' }) {
  return (
    <Tabs defaultValue="overview" {...props}>
      <Tabs.List aria-label="Project sections">
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="activity">Activity</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      <Tabs.Panel value="activity">Activity content</Tabs.Panel>
      <Tabs.Panel value="settings">Settings content</Tabs.Panel>
    </Tabs>
  );
}

describe('Tabs', () => {
  it('shows only the selected panel and links it to its tab', () => {
    setup(<Demo />);
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview content');
    expect(screen.getByRole('tabpanel')).toHaveAccessibleName('Overview');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('aria-selected', 'true');
  });

  it('uses a roving tabindex', () => {
    setup(<Demo />);
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveAttribute('tabindex', '-1');
  });

  it('changes tab on click', async () => {
    const { user } = setup(<Demo />);
    await user.click(screen.getByRole('tab', { name: 'Settings' }));
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Settings content');
  });

  it('moves with arrow keys, wrapping at the ends, plus Home and End', async () => {
    const { user } = setup(<Demo />);
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity content');

    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(screen.getByRole('tab', { name: 'Settings' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('tab', { name: 'Overview' })).toHaveFocus();
  });

  it('waits for Enter in manual activation', async () => {
    const { user } = setup(<Demo activation="manual" />);
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Activity' })).toHaveFocus();
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview content');
    await user.keyboard('{Enter}');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Activity content');
  });

  it('has no axe violations', async () => {
    const { container } = setup(<Demo />);
    await expectNoA11yViolations(container);
  });
});
