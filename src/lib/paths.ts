/**
 * Helper to prepend basePath to asset URLs for GitHub Pages deployment
 */
export function assetPath(path: string): string {
  // In production (static export), prepend BASE_PATH environment variable if set
  const basePath = typeof window !== 'undefined' 
    ? (window as any).__NEXT_DATA__?.basePath || ''
    : process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  if (!path.startsWith('/')) return path;
  if (basePath && !path.startsWith(basePath)) {
    return `${basePath}${path}`;
  }
  return path;
}
