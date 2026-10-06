import { useEffect } from 'react';
export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    document.title = `${title} — Motor Atlas`;
    for (const [selector, content] of [
      ['meta[name="description"]', description],
      ['meta[property="og:title"]', `${title} — Motor Atlas`],
      ['meta[property="og:description"]', description],
    ]) {
      document.querySelector(selector)?.setAttribute('content', content);
    }
  }, [title, description]);
}
