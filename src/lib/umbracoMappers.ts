/**
 * Mappers to convert Umbraco content to component interfaces
 * Maintains compatibility with existing React component data structures
 */

import type { UmbracoThread, UmbracoEvent, UmbracoSpeaker, UmbracoProject, Thread, Event, Speaker } from '../types';
import { getImageUrl } from './content';

/**
 * Get Umbraco base URL from environment
 */
function getUmbracoBaseUrl(): string {
  const url = import.meta.env.PUBLIC_UMBRACO_API_URL;
  if (!url) {
    console.warn('PUBLIC_UMBRACO_API_URL not set, media URLs may be broken');
    return '';
  }
  // Remove trailing slash if present
  return url.endsWith('/') ? url.slice(0, -1) : url;
}

/**
 * Construct full media URL from relative path
 */
function getFullMediaUrl(mediaPath: string | undefined): string | undefined {
  if (!mediaPath) return undefined;
  
  // If already absolute URL, return as-is
  if (mediaPath.startsWith('http://') || mediaPath.startsWith('https://')) {
    return mediaPath;
  }
  
  // If starts with /, it's a relative path from root
  const baseUrl = getUmbracoBaseUrl();
  if (!baseUrl) return mediaPath;
  
  // Ensure media path starts with /
  const normalizedPath = mediaPath.startsWith('/') ? mediaPath : `/${mediaPath}`;
  return `${baseUrl}${normalizedPath}`;
}

/**
 * Map Umbraco Thread to Thread interface
 */
export function mapThread(umbracoThread: UmbracoThread): Thread {
  return {
    id: umbracoThread.id,
    category: umbracoThread.properties.category || '',
    timestamp: umbracoThread.properties.timestamp || umbracoThread.createDate,
    title: umbracoThread.properties.title || umbracoThread.name,
    user: umbracoThread.properties.user || '',
    status: umbracoThread.properties.status || 'ACTIVE',
  };
}

/**
 * Map Umbraco Event to Event interface
 */
export function mapEvent(umbracoEvent: UmbracoEvent): Event {
  return {
    id: umbracoEvent.id,
    category: umbracoEvent.properties.category || '',
    timestamp: umbracoEvent.properties.timestamp || umbracoEvent.createDate,
    title: umbracoEvent.properties.title || umbracoEvent.name,
    user: umbracoEvent.properties.user || '',
    status: umbracoEvent.properties.status || 'STABLE',
  };
}

/**
 * Map Umbraco Speaker to Speaker interface
 */
export function mapSpeaker(umbracoSpeaker: UmbracoSpeaker): Speaker {
  // Handle image - it's a media picker array, extract the first item's URL
  const image = umbracoSpeaker.properties.image || umbracoSpeaker.properties.imageUrl;
  
  // Use the helper function first
  let imageUrl = getImageUrl(image);
  
  // If helper didn't work, try additional structures
  if (!imageUrl && image) {
    if (Array.isArray(image) && image.length > 0) {
      const firstImage = image[0];
      
      // Umbraco Delivery API media items might have nested structures
      // Try accessing nested properties
      if (firstImage && typeof firstImage === 'object') {
        // Check for nested url in various possible locations
        imageUrl = firstImage.url || 
                   firstImage.src || 
                   firstImage.content?.url ||
                   firstImage.mediaItems?.[0]?.url ||
                   firstImage.mediaItems?.[0]?.src;
        
        // If we have an ID but no URL, we might need to construct it
        // Umbraco media URLs are typically: /media/{id}/{filename}
        if (!imageUrl && firstImage.id) {
          console.warn('[mapSpeaker] Image has ID but no URL, may need to construct URL:', firstImage.id);
          // Could construct URL here if we know the base URL pattern
        }
      }
    }
  }
  
  // Prepend Umbraco base URL if the URL is relative
  const fullImageUrl = getFullMediaUrl(imageUrl);
  

  return {
    id: umbracoSpeaker.id,
    name: umbracoSpeaker.properties.speakerName || umbracoSpeaker.name,
    role: umbracoSpeaker.properties.role || '',
    node: umbracoSpeaker.properties.node || '',
    status: umbracoSpeaker.properties.status || 'ONLINE',
    handle: umbracoSpeaker.properties.handle || '',
    imageUrl: fullImageUrl,
    bio: umbracoSpeaker.properties.bio,
    clearanceLevel: umbracoSpeaker.properties.clearanceLevel,
  };
}

/**
 * Map Umbraco Project to Project interface
 */
export function mapProject(umbracoProject: UmbracoProject) {
  // Handle image - similar to speaker mapping
  const image = umbracoProject.properties.image || umbracoProject.properties.imageUrl;
  let imageUrl = getImageUrl(image);
  
  // If helper didn't work, try additional structures
  if (!imageUrl && image) {
    if (Array.isArray(image) && image.length > 0) {
      const firstImage = image[0];
      if (firstImage && typeof firstImage === 'object') {
        imageUrl = firstImage.url || 
                   firstImage.src || 
                   firstImage.content?.url ||
                   firstImage.mediaItems?.[0]?.url ||
                   firstImage.mediaItems?.[0]?.src;
      }
    }
  }
  
  // Prepend Umbraco base URL if the URL is relative
  const fullImageUrl = getFullMediaUrl(imageUrl);

  return {
    id: umbracoProject.id,
    title: umbracoProject.properties.title || umbracoProject.name,
    author: umbracoProject.properties.author || '',
    description: umbracoProject.properties.description || '',
    imageUrl: fullImageUrl || '',
    link: umbracoProject.properties.link || '#',
    client: umbracoProject.properties.client || '',
    category: umbracoProject.properties.category || '',
    tech: umbracoProject.properties.techStack || [],
  };
}

