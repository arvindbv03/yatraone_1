/**
 * Helper to prepend basePath to asset URLs for GitHub Pages deployment
 * In static export mode, we read basePath from the environment at build time
 */
export function assetPath(path: string): string {
  if (!path.startsWith('/')) return path;
  
  // Get basePath from environment (set during build)
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  
  if (basePath && !path.startsWith(basePath)) {
    return `${basePath}${path}`;
  }
  return path;
}
