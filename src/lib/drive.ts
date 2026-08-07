/**
 * Extract the file id from any common Google Drive link shape.
 */
export function extractDriveId(link: string): string | null {
  if (!link) return null;
  const patterns = [
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
    /uc\?export=\w+&id=([a-zA-Z0-9_-]+)/,
  ];
  for (const p of patterns) {
    const m = link.match(p);
    if (m?.[1]) return m[1];
  }
  // Bare id fallback
  if (/^[a-zA-Z0-9_-]{20,}$/.test(link.trim())) return link.trim();
  return null;
}

/** Direct-view thumbnail image URL from a Drive link. */
export function driveImageUrl(link: string, size = 1200): string {
  const id = extractDriveId(link);
  if (!id) return link;
  return `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`;
}

/** Streamable audio URL from a Drive link. */
export function driveAudioUrl(link: string): string {
  const id = extractDriveId(link);
  if (!id) return link;
  return `https://drive.google.com/uc?export=download&id=${id}`;
}
