/**
 * Helper to prepend basePath to asset URLs for GitHub Pages deployment
 * Uses the __dirname trick to detect base path at runtime
 */
export function assetPath(path: string): string {
  if (!path.startsWith('/')) return path;
  
  // At build time, NEXT_PUBLIC_BASE_PATH is set by next.config.ts
  // At runtime on GitHub Pages, we detect the base path from the hostname
  const basePath = typeof window !== 'undefined' 
    ? '/yatraone_1'  // Hardcoded for GitHub Pages deployment
    : (process.env.NEXT_PUBLIC_BASE_PATH || '');
  
  if (basePath && !path.startsWith(basePath)) {
    return `${basePath}${path}`;
  }
  return path;
}
