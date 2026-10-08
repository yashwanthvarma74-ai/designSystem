import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../Button';
import { FormField } from '../FormField';
import { Input } from '../Input';
import { Dialog } from './Dialog';

const meta = {
  title: 'Components/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  args: { open: false, onOpenChange: () => {}, children: null },
  argTypes: { size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] } },
  parameters: {
    docs: {
      description: {
        component:
          'A modal dialog. Focus moves in when it opens, `Tab` is trapped, `Escape` closes it, the page behind becomes inert, and focus returns to the trigger afterwards.',
      },
    },
  },
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="primary" onClick={() => setOpen(true)}>
          Rename project
        </Button>
        <Dialog {...args} open={open} onOpenChange={setOpen}>
          <Dialog.Header>
            <Dialog.Title>Rename project</Dialog.Title>
            <Dialog.Description>Everyone with access will see the new name.</Dialog.Description>
            <Dialog.Close />
          </Dialog.Header>
          <Dialog.Body>
            <FormField label="Project name">
              <Input defaultValue="Quarterly planning" />
            </FormField>
          </Dialog.Body>
          <Dialog.Footer>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => setOpen(false)}>
              Save
            </Button>
          </Dialog.Footer>
        </Dialog>
      </>
    );
  },
};

export const Confirmation: Story = {
  render: function Render(args) {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant="danger" onClick={() => setOpen(true)}>
          Delete project
        </Button>
        <Dialog
          {...args}
          open={open}
          onOpenChange={setOpen}
          role="alertdialog"
          size="sm"
          dismissOnOverlayClick={false}
        >
          <Dialog.Header>
            <Dialog.Title>Delete this project?</Dialog.Title>
            <Dialog.Description>
              This cannot be undone. All documents will be removed.
            </Dialog.Description>
          </Dialog.Header>
          <Dialog.Footer>
            <Button onClick={() => setOpen(false)}>Keep project</Button>
            <Button variant="danger" onClick={() => setOpen(false)}>
              Delete
            </Button>
          </Dialog.Footer>
        </Dialog>
      </>
    );
  },
};

export const OpenOnLoad: Story = {
  tags: ['!autodocs'],
  render: (args) => (
    <Dialog {...args} open onOpenChange={() => {}}>
      <Dialog.Header>
        <Dialog.Title>Welcome</Dialog.Title>
        <Dialog.Description>A dialog that starts open, handy for visual tests.</Dialog.Description>
      </Dialog.Header>
      <Dialog.Footer>
        <Button variant="primary">Get started</Button>
      </Dialog.Footer>
    </Dialog>
  ),
};
