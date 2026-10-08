import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties } from 'react';
import tokens from '../../../packages/tokens/dist/tokens.json';

const meta = {
  title: 'Foundations/Tokens',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Every swatch reads its colour from a CSS variable, so switching the theme in the toolbar updates them live.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;

const page: CSSProperties = {
  fontFamily: 'var(--mrd-font-family-sans)',
  color: 'var(--mrd-color-text-primary)',
};
const heading: CSSProperties = {
  margin: '0 0 12px',
  fontSize: 13,
  fontWeight: 600,
  letterSpacing: '0.04em',
  textTransform: 'uppercase',
  color: 'var(--mrd-color-text-secondary)',
};
const grid: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(168px, 1fr))',
  gap: 12,
};

const themeColors = Object.keys(tokens.themes.light).filter((n) => n.startsWith('color-'));
const groups = ['bg', 'text', 'border', 'accent', 'focus', 'danger', 'success', 'warning', 'info'];

function Swatch({ name }: { name: string }) {
  return (
    <div
      style={{
        border: '1px solid var(--mrd-color-border-subtle)',
        borderRadius: 10,
        overflow: 'hidden',
        background: 'var(--mrd-color-bg-surface)',
      }}
    >
      <div
        style={{
          height: 48,
          background: `var(--mrd-${name})`,
          borderBottom: '1px solid var(--mrd-color-border-subtle)',
        }}
      />
      <div style={{ padding: '8px 10px', fontSize: 12 }}>
        <div style={{ fontWeight: 600 }}>{name.replace('color-', '')}</div>
        <code style={{ color: 'var(--mrd-color-text-secondary)', fontSize: 11 }}>--mrd-{name}</code>
      </div>
    </div>
  );
}

export const Colors: Story = {
  render: () => (
    <div style={{ ...page, display: 'grid', gap: 32, width: '100%' }}>
      {groups.map((group) => (
        <section key={group}>
          <h3 style={heading}>{group}</h3>
          <div style={grid}>
            {themeColors
              .filter((n) => n.startsWith(`color-${group}-`))
              .map((n) => (
                <Swatch key={n} name={n} />
              ))}
          </div>
        </section>
      ))}
    </div>
  ),
};

const sizes = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'];

export const Typography: Story = {
  render: () => (
    <div style={{ ...page, display: 'grid', gap: 16, width: '100%', maxWidth: 720 }}>
      {sizes.map((s) => (
        <div
          key={s}
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 16,
            borderBottom: '1px solid var(--mrd-color-border-subtle)',
            paddingBottom: 12,
          }}
        >
          <code
            style={{
              width: 56,
              flexShrink: 0,
              fontSize: 12,
              color: 'var(--mrd-color-text-secondary)',
            }}
          >
            {s}
          </code>
          <span style={{ fontSize: `var(--mrd-font-size-${s})`, fontWeight: 500 }}>
            Sphinx of black quartz, judge my vow
          </span>
        </div>
      ))}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        {['regular', 'medium', 'semibold', 'bold'].map((w) => (
          <span
            key={w}
            style={{ fontWeight: `var(--mrd-font-weight-${w})` as never, fontSize: 18 }}
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  ),
};

const spaces = ['1', '2', '3', '4', '5', '6', '8', '10', '12', '16'];

export const Spacing: Story = {
  render: () => (
    <div style={{ ...page, display: 'grid', gap: 10, width: '100%', maxWidth: 560 }}>
      {spaces.map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <code style={{ width: 72, fontSize: 12, color: 'var(--mrd-color-text-secondary)' }}>
            space-{s}
          </code>
          <div
            style={{
              height: 14,
              width: `var(--mrd-space-${s})`,
              background: 'var(--mrd-color-accent-default)',
              borderRadius: 3,
            }}
          />
          <span style={{ fontSize: 12, color: 'var(--mrd-color-text-secondary)' }}>
            {tokens.base[`space-${s}` as keyof typeof tokens.base]}
          </span>
        </div>
      ))}
    </div>
  ),
};

export const RadiusShadowMotion: Story = {
  name: 'Radius, shadow and motion',
  render: () => (
    <div style={{ ...page, display: 'grid', gap: 32, width: '100%' }}>
      <section>
        <h3 style={heading}>Radius</h3>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {['sm', 'md', 'lg', 'xl', '2xl', 'full'].map((r) => (
            <div key={r} style={{ textAlign: 'center', fontSize: 12 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  border: '2px solid var(--mrd-color-accent-default)',
                  background: 'var(--mrd-color-accent-subtle)',
                  borderRadius: `var(--mrd-radius-${r})`,
                  marginBottom: 6,
                }}
              />
              {r}
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 style={heading}>Shadow</h3>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', padding: 8 }}>
          {['xs', 'sm', 'md', 'lg', 'xl'].map((s) => (
            <div
              key={s}
              style={{
                width: 96,
                height: 72,
                borderRadius: 10,
                background: 'var(--mrd-color-bg-surface)',
                boxShadow: `var(--mrd-shadow-${s})`,
                display: 'grid',
                placeItems: 'center',
                fontSize: 12,
              }}
            >
              {s}
            </div>
          ))}
        </div>
      </section>
      <section>
        <h3 style={heading}>Motion</h3>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 14, lineHeight: 1.8 }}>
          {Object.entries(tokens.base)
            .filter(([k]) => k.startsWith('motion-'))
            .map(([k, v]) => (
              <li key={k}>
                <code>{k}</code>: {v}
              </li>
            ))}
        </ul>
      </section>
    </div>
  ),
};
