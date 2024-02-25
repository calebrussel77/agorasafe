import slugify from 'slugify';

export function slugit(value: string) {
  return slugify(value, { lower: true, strict: true });
}

export function postgresSlugify(str: string) {
  return str
    .replace(' ', '_')
    .replace(/[^a-zA-Z0-9_]/g, '')
    .toLowerCase();
}

export function removeTags(str: string) {
  if (!str) return '';

  // Replace all HTML tags with a single space
  const stringWithoutTags = str.replace(/<[^>]*>/g, ' ');

  // Replace multiple spaces with a single space
  const stringWithoutExtraSpaces = stringWithoutTags.replace(/\s+/g, ' ');

  // Trim the resulting string to remove leading/trailing spaces
  return stringWithoutExtraSpaces.trim();
}

export function toTitleCase(str: string) {
  return str.replace(
    /\w\S*/g,
    txt => txt.charAt(0)?.toUpperCase() + txt.slice(1)?.toLowerCase()
  );
}

export function extractDomainName(url: string): string {
  // Utilisation de l'API URL pour parser l'URL fournie
  try {
    const urlParsed = new URL(url);
    // Extraction de l'hôte (nom de domaine + extension)
    return urlParsed.hostname;
  } catch (error) {
    console.error('URL invalide :', error);
    return 'URL invalide';
  }
}
