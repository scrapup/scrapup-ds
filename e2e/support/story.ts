import type { Page } from '@playwright/test';

export type StoryArgs = Record<string, string | number | boolean>;

const FONT_HOSTS = /^https:\/\/fonts\.(googleapis|gstatic)\.com\//;

/** Serializes args in Storybook's URL format: `key:value;key2:value2`. */
export function encodeArgs(args: StoryArgs): string {
  return Object.entries(args)
    .map(([key, value]) => `${key}:${encodeURIComponent(String(value))}`)
    .join(';');
}

/**
 * Opens a story in isolation (iframe) with Google Fonts requests aborted, so runs are
 * network-independent and deterministic. Resolves once the story has rendered content.
 */
export async function gotoStory(page: Page, id: string, args?: StoryArgs): Promise<void> {
  await page.route(FONT_HOSTS, (route) => route.abort());
  const query = new URLSearchParams({ id, viewMode: 'story' });
  const argsParam = args ? `&args=${encodeArgs(args)}` : '';
  await page.goto(`/iframe.html?${query.toString()}${argsParam}`);
  await page.locator('#storybook-root > *').first().waitFor();
}
