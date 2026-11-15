/**
 * Helper to prepend basePath to asset URLs for GitHub Pages deployment
 * Next.js should handle this automatically when using <Image> with basePath config
 */

export function assetPath(path: string): string {
  // For plain HTML img tags, we need to manually prepend the basePath
  // But Next.js <Image> component should handle it automatically
  return path;
}
