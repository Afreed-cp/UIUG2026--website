/**
 * Content rendering utilities for Umbraco content
 */

/**
 * Render Umbraco rich text content
 * For now, returns HTML as-is (can be enhanced with sanitization)
 */
export function renderRichText(umbracoContent: any): string {
  if (typeof umbracoContent === 'string') {
    return umbracoContent;
  }
  if (umbracoContent?.markup) {
    return umbracoContent.markup;
  }
  return '';
}

/**
 * Get image URL from Umbraco media property
 */
export function getImageUrl(imageProperty: any): string | undefined {
  if (typeof imageProperty === 'string') {
    return imageProperty;
  }
  if (imageProperty?.url) {
    return imageProperty.url;
  }
  if (Array.isArray(imageProperty) && imageProperty[0]?.url) {
    return imageProperty[0].url;
  }
  return undefined;
}

/**
 * Format date from Umbraco
 */
export function formatDate(dateString: string): string {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Generate excerpt from content
 */
export function getExcerpt(content: string, length: number = 150): string {
  if (!content) return '';
  
  // Remove HTML tags for excerpt
  const text = content.replace(/<[^>]*>/g, '');
  
  if (text.length <= length) {
    return text;
  }
  
  return text.substring(0, length).trim() + '...';
}

/**
 * Get Umbraco API Base URL for constructing full media URLs
 */
export function getUmbracoBaseUrl(): string {
  const url = import.meta.env.PUBLIC_UMBRACO_API_URL;
  if (!url) {
    throw new Error('PUBLIC_UMBRACO_API_URL environment variable is not set.');
  }
  // Extract base URL without the /umbraco/delivery/api/v2 part
  const parts = url.split('/umbraco/delivery/api/v2');
  return parts[0] || url; // Fallback to full URL if split fails
}

