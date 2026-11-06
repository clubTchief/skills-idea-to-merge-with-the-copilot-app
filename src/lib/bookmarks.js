const slugAlphabet = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const slugPattern = /^mona-[0-9a-zA-Z]{4}$/;

export function normalizeUrl(value) {
  if (typeof value !== 'string' || value.trim() === '') {
    throw new TypeError('A URL is required.');
  }

  const trimmed = value.trim();
  const withProtocol = trimmed.startsWith('//')
    ? `https:${trimmed}`
    : /^[a-z][a-z\d+.-]*:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
  const url = new URL(withProtocol);

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new TypeError('Only HTTP and HTTPS URLs are supported.');
  }

  return url.href;
}

export function generateSlug(random = Math.random) {
  let suffix = '';
  for (let index = 0; index < 4; index += 1) {
    suffix += slugAlphabet[Math.floor(random() * slugAlphabet.length)];
  }
  return `mona-${suffix}`;
}

export function loadBookmarks(serialized) {
  if (typeof serialized !== 'string' || serialized.trim() === '') return [];

  let value;
  try {
    value = JSON.parse(serialized);
  } catch {
    return [];
  }

  if (!Array.isArray(value)) return [];
  return value.filter((bookmark) => {
    if (
      typeof bookmark !== 'object'
      || bookmark === null
      || typeof bookmark.url !== 'string'
      || typeof bookmark.slug !== 'string'
      || !slugPattern.test(bookmark.slug)
    ) {
      return false;
    }

    try {
      const url = new URL(bookmark.url);
      return (url.protocol === 'http:' || url.protocol === 'https:') && url.href === bookmark.url;
    } catch {
      return false;
    }
  }).map(({ url, slug }) => ({ url, slug }));
}

export function formatBookmark({ url, slug }) {
  return `${url} :: ${slug}`;
}
