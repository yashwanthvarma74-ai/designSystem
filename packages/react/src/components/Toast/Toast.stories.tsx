import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../Button';
import { ToastProvider, useToast } from './Toast';

const meta = {
  title: 'Components/Toast',
  component: ToastProvider,
  tags: ['autodocs'],
  args: { children: null },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Wrap the app in `ToastProvider`, then call `useToast().toast({...})`. Messages are announced to screen readers, pause while hovered or focused, and `F8` moves keyboard focus to them. Errors and warnings use the `alert` role.',
      },
    },
  },
} satisfies Meta<typeof ToastProvider>;
export default meta;
type Story = StoryObj<typeof meta>;

function Buttons() {
  const { toast } = useToast();
  return (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      <Button onClick={() => toast({ title: 'Changes saved', variant: 'success' })}>Success</Button>
      <Button
        onClick={() =>
          toast({
            title: 'Heads up',
            description: 'Your trial ends in 3 days.',
            variant: 'warning',
          })
        }
      >
        Warning
      </Button>
      <Button
        onClick={() =>
          toast({
            title: 'Upload failed',
            description: 'The file is larger than 10 MB.',
            variant: 'danger',
          })
        }
      >
        Error
      </Button>
      <Button
        onClick={() =>
          toast({
            title: 'Message archived',
            action: { label: 'Undo', onClick: () => {} },
            duration: 8000,
          })
        }
      >
        With action
      </Button>
    </div>
  );
}

export const Default: Story = { render: () => <Buttons /> };
