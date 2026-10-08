import { request } from '@playwright/test';

export interface StoryEntry {
  id: string;
  title: string;
  name: string;
  type: 'story' | 'docs';
  tags?: string[];
}

// Reads the list of stories from the built Storybook, so tests never fall out of date.
export async function loadStories(baseURL = 'http://localhost:6006'): Promise<StoryEntry[]> {
  const api = await request.newContext({ baseURL });
  const response = await api.get('/index.json');
  const index = (await response.json()) as { entries: Record<string, StoryEntry> };
  await api.dispose();
  return Object.values(index.entries).filter((entry) => entry.type === 'story');
}

export const themes = ['light', 'dark', 'high-contrast'] as const;

export function storyUrl(id: string, theme: (typeof themes)[number] = 'light') {
  return `/iframe.html?id=${id}&viewMode=story&globals=theme:${theme}`;
}
