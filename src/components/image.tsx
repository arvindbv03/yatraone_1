import NextImage, { ImageProps } from "next/image";
import { assetPath } from "@/lib/paths";

/**
 * Custom Image wrapper that applies basePath to src
 * This fixes the issue where Next.js Image with unoptimized: true
 * doesn't apply basePath to the src attribute
 */
export function Image(props: ImageProps) {
  let src = props.src;
  
  // Only apply assetPath to string paths, not to static imports
  if (typeof src === "string") {
    src = assetPath(src);
  }
  
  return (
    <NextImage
      {...props}
      src={src}
    />
  );
}


