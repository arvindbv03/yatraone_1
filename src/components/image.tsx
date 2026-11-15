"use client";

import { HTMLAttributes } from "react";
import { assetPath } from "@/lib/paths";

/**
 * Custom Image component that renders plain <img> tags with basePath applied
 * This works around the issue where Next.js Image with unoptimized: true
 * doesn't apply basePath to the src attribute
 */
interface ImageProps extends HTMLAttributes<HTMLImageElement> {
  src: string | { src: string; width?: number; height?: number };
  alt: string;
  fill?: boolean;
  priority?: boolean;
  preload?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function Image({ src, fill, priority, preload, sizes, width, height, ...props }: ImageProps) {
  // Handle both string and object src formats
  let srcStr: string;
  if (typeof src === "string") {
    srcStr = src;
  } else {
    srcStr = src.src;
  }
  
  // DEBUG: Log the original and modified src
  const originalSrc = srcStr;
  const finalSrc = assetPath(srcStr);
  
  if (originalSrc !== finalSrc) {
    console.warn("Image wrapper: Modified src from", originalSrc, "to", finalSrc);
  } else if (originalSrc.includes("/images/")) {
    console.warn("Image wrapper: assetPath returned same value:", originalSrc);
  }
  
  // For fill images, use absolute positioning
  if (fill) {
    return (
      <img
        {...props}
        src={finalSrc}
        alt={props.alt || "Image"}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          ...props.style
        }}
      />
    );
  }
  
  // Regular image with explicit dimensions
  return (
    <img
      {...props}
      src={finalSrc}
      alt={props.alt || "Image"}
      width={width}
      height={height}
    />
  );
}







