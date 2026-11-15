/**
 * Helper to prepend basePath to asset URLs for GitHub Pages deployment
 * Since we're now hardcoding basePath in data.ts, this function can be simplified
 * or left as a safety check for any future image paths
 */

export function assetPath(path: string): string {
  if (!path.startsWith('/')) return path;
  
  // If path already includes basePath, return as-is
  if (path.startsWith('/yatraone_1/')) return path;
  
  // Otherwise, prepend it
  return `/yatraone_1${path}`;
}
