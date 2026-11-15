/**
 * Helper to prepend basePath to asset URLs for GitHub Pages deployment
 * Since Next.js Image component with unoptimized doesn't apply basePath,
 * we must do it manually here.
 */

export function assetPath(path: string): string {
  if (!path.startsWith('/')) return path;
  
  // Hardcode the basePath for GitHub Pages deployment
  // This is /yatraone_1 in production, empty string for local dev
  const basePath = '/yatraone_1';
  
  if (basePath && !path.startsWith(basePath)) {
    return `${basePath}${path}`;
  }
  return path;
}
