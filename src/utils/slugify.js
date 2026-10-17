export function slugify(text) {
  if (!text) return '';
  
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export function generateProductSlug(name, id) {
  const slug = slugify(name);
  return id ? `${slug}-${id}` : slug;
}

export function generateCategorySlug(name) {
  return slugify(name);
}