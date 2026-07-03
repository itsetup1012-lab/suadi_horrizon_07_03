import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely extract a non-empty image URL from various product image formats.
 * Handles: string URLs, objects with { url }, and falsy values.
 * Returns null when no valid URL is available so callers can show a placeholder.
 */
export function getSafeImageUrl(image: unknown): string | null {
  if (!image) return null;
  if (typeof image === 'string') return image.trim() || null;
  if (typeof image === 'object' && image !== null && 'url' in image) {
    const url = (image as { url?: string }).url;
    return typeof url === 'string' && url.trim() ? url.trim() : null;
  }
  return null;
}

