/**
 * Umbraco Delivery API Client
 * Handles all communication with Umbraco Content Delivery API v2
 */

import https from 'https';
import type { IncomingMessage } from 'http';

// Create an HTTPS agent that accepts self-signed certificates for localhost
const httpsAgent = new https.Agent({
  rejectUnauthorized: false, // Only for localhost development
});

// Custom fetch function that handles SSL for localhost
async function customFetch(url: string, options?: RequestInit): Promise<Response> {
  const urlObj = new URL(url);
  
  // For localhost HTTPS, use the custom agent
  if (urlObj.hostname === 'localhost' && urlObj.protocol === 'https:') {
    // Use node's https module for localhost with self-signed certs
    return new Promise<Response>((resolve, reject) => {
      const req = https.request(url, {
        method: options?.method || 'GET',
        agent: httpsAgent,
        headers: options?.headers as Record<string, string>,
      }, (res: IncomingMessage) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk: Buffer) => chunks.push(chunk));
        res.on('end', () => {
          const body = Buffer.concat(chunks).toString();
          resolve(new Response(body, {
            status: res.statusCode || 200,
            statusText: res.statusMessage || 'OK',
            headers: res.headers as HeadersInit,
          }));
        });
      });
      
      req.on('error', reject);
      if (options?.body) {
        req.write(options.body);
      }
      req.end();
    });
  }
  
  // For other URLs, use standard fetch
  return fetch(url, options);
}

// Get environment variables - these are available at build time and runtime
function getApiBaseUrl(): string {
  const url = import.meta.env.PUBLIC_UMBRACO_API_URL;
  if (!url) {
    throw new Error('PUBLIC_UMBRACO_API_URL environment variable is not set. Please create a .env file with PUBLIC_UMBRACO_API_URL=https://localhost:44381');
  }
  return url;
}

function getApiKey(): string {
  const key = import.meta.env.UMBRACO_DELIVERY_API_KEY;
  if (!key) {
    throw new Error('UMBRACO_DELIVERY_API_KEY environment variable is not set. Please create a .env file with your API key.');
  }
  return key;
}

interface UmbracoApiResponse<T> {
  items: T[];
  total: number;
}

interface UmbracoContentItem {
  id: string;
  name: string;
  contentType: string;
  route: {
    path: string;
  };
  properties: Record<string, any>;
  createDate: string;
  updateDate: string;
}

/**
 * Fetch content items from Umbraco Delivery API
 */
export async function fetchContentItems(
  contentType?: string,
  filters?: Record<string, any>
): Promise<UmbracoContentItem[]> {
  const API_BASE_URL = getApiBaseUrl();
  const url = new URL(`${API_BASE_URL}/umbraco/delivery/api/v2/content`);
  
  if (contentType) {
    url.searchParams.append('filter', `contentType:${contentType}`);
  }
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }
  
  // Expand properties by default
  url.searchParams.append('expand', 'properties[$all]');
  url.searchParams.append('fields', 'properties[$all]');
  
  try {
    const API_KEY = getApiKey();
    const fullUrl = url.toString();
    const response = await customFetch(fullUrl, {
      headers: {
        'Authorization': `Api-Key ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Umbraco API error: ${response.status} ${response.statusText}`);
    }
    
    const data: UmbracoApiResponse<UmbracoContentItem> = await response.json();
    return data.items || [];
  } catch (error) {
    console.error('Error fetching content from Umbraco:', error);
    console.error('URL:', url.toString());
    throw error;
  }
}

/**
 * Fetch a single content item by route
 */
export async function fetchContentByRoute(route: string): Promise<UmbracoContentItem | null> {
  try {
    const API_BASE_URL = getApiBaseUrl();
    const url = new URL(`${API_BASE_URL}/umbraco/delivery/api/v2/content/item`);
    url.searchParams.append('path', route);
    url.searchParams.append('expand', 'properties');
    url.searchParams.append('fields', '*');
    
    const API_KEY = getApiKey();
    const fullUrl = url.toString();
    
    const response = await customFetch(fullUrl, {
      headers: {
        'Authorization': `Api-Key ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorText = await response.text();
      console.error(`[Umbraco API] Error ${response.status}:`, errorText);
      throw new Error(`Umbraco API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: UmbracoContentItem = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching content by route from Umbraco:', error);
    console.error('Route:', route);
    return null;
  }
}

/**
 * Fetch content by slug and content type
 */
export async function fetchContentBySlug(
  slug: string,
  contentType: string
): Promise<UmbracoContentItem | null> {
  const items = await fetchContentItems(contentType);
  const item = items.find((item) => {
    const itemSlug = item.route.path.split('/').filter(Boolean).pop();
    return itemSlug === slug;
  });
  
  return item || null;
}

/**
 * Fetch a single content item by ID
 */
export async function fetchContentById(id: string): Promise<UmbracoContentItem | null> {
  try {
    const API_BASE_URL = getApiBaseUrl();
    const url = new URL(`${API_BASE_URL}/umbraco/delivery/api/v2/content/item/${id}`);
    url.searchParams.append('expand', 'properties[$all]');
    url.searchParams.append('fields', 'properties[$all]');
    
    const API_KEY = getApiKey();
    const fullUrl = url.toString();
    
    const response = await customFetch(fullUrl, {
      headers: {
        'Authorization': `Api-Key ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      const errorText = await response.text();
      console.error(`[Umbraco API] Error ${response.status}:`, errorText);
      throw new Error(`Umbraco API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: UmbracoContentItem = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching content by ID from Umbraco:', error);
    console.error('ID:', id);
    return null;
  }
}

/**
 * Fetch homepage content
 */
export async function fetchHomepage(): Promise<UmbracoContentItem | null> {
  // Try root route first
  const rootContent = await fetchContentByRoute('/');
  if (rootContent && rootContent.contentType === 'homepage') {
    return rootContent;
  }
  
  // Fallback: fetch by content type
  const homepages = await fetchContentItems('homepage');
  return homepages[0] || null;
}

/**
 * Fetch Site Settings document
 * Site Settings contains header and footer configuration
 */
export async function fetchSiteSettings(): Promise<UmbracoContentItem | null> {
  const settings = await fetchContentItems('siteSettings');
  return settings[0] || null;
}

/**
 * Fetch children of a content item by parent ID
 * Optionally filter by content type for efficiency
 */
export async function fetchChildren(
  parentId: string, 
  contentType?: string
): Promise<UmbracoContentItem[]> {
  try {
    // First, fetch the parent item to get its route
    const parent = await fetchContentById(parentId);
    if (!parent) {
      console.warn(`[fetchChildren] Parent with ID ${parentId} not found`);
      return [];
    }
    
    const parentRoute = parent.route.path;
    const parentRouteDepth = parentRoute.split('/').filter(Boolean).length;
    
    // Fetch content items, optionally filtered by content type
    const API_BASE_URL = getApiBaseUrl();
    const url = new URL(`${API_BASE_URL}/umbraco/delivery/api/v2/content`);
    
    if (contentType) {
      url.searchParams.append('filter', `contentType:${contentType}`);
    }
    
    url.searchParams.append('expand', 'properties[$all]');
    url.searchParams.append('fields', 'properties[$all]');
    
    const API_KEY = getApiKey();
    const fullUrl = url.toString();
    
    const response = await customFetch(fullUrl, {
      headers: {
        'Authorization': `Api-Key ${API_KEY}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[Umbraco API] Error ${response.status}:`, errorText);
      console.error('URL:', fullUrl);
      throw new Error(`Umbraco API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    
    const data: UmbracoApiResponse<UmbracoContentItem> = await response.json();
    const allItems = data.items || [];
    
    // Filter for direct children: items whose route starts with parent route and is exactly one level deeper
    const children = allItems.filter(item => {
      const itemRoute = item.route.path;
      const itemRouteParts = itemRoute.split('/').filter(Boolean);
      const expectedDepth = parentRouteDepth + 1;
      
      // Normalize routes for comparison
      const normalizedParentRoute = parentRoute === '/' ? '' : parentRoute.endsWith('/') ? parentRoute.slice(0, -1) : parentRoute;
      const normalizedItemRoute = itemRoute.endsWith('/') ? itemRoute.slice(0, -1) : itemRoute;
      
      // Check if the item's route starts with the parent route and is exactly one level deeper
      return normalizedItemRoute.startsWith(normalizedParentRoute) && 
             itemRouteParts.length === expectedDepth &&
             normalizedItemRoute !== normalizedParentRoute; // Exclude the parent itself
    });
    
    return children;
  } catch (error) {
    console.error('Error fetching children from Umbraco:', error);
    console.error('Parent ID:', parentId);
    throw error;
  }
}

