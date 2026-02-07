/**
 * TypeScript interfaces for Umbraco content types
 * Based on Umbraco document types and Delivery API structure
 */

export interface UmbracoContentItem {
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

export interface UmbracoMetaData {
  seoTitle?: string;
  seoDescription?: string;
  metaKeywords?: string;
  ogImage?: {
    url: string;
    alt?: string;
  };
}

export interface UmbracoBlogPost extends UmbracoContentItem {
  contentType: 'blogPost';
  properties: {
    title: string;
    publishDate: string;
    excerpt?: string;
    content?: string;
    author?: string;
    category?: string;
    status?: string;
    slug?: string;
    seoTitle?: string;
    seoDescription?: string;
    metaKeywords?: string;
    ogImage?: {
      url: string;
      alt?: string;
    };
  };
}

export interface UmbracoPage extends UmbracoContentItem {
  contentType: 'page';
  properties: {
    pageTitle?: string;
    content?: string;
    seoTitle?: string;
    seoDescription?: string;
    metaKeywords?: string;
    ogImage?: {
      url: string;
      alt?: string;
    };
  };
}

export interface UmbracoThread extends UmbracoContentItem {
  contentType: 'thread';
  properties: {
    title: string;
    category: string;
    timestamp: string;
    user: string;
    status: string;
    slug?: string;
  };
}

export interface UmbracoEvent extends UmbracoContentItem {
  contentType: 'event';
  properties: {
    title: string;
    category: string;
    timestamp: string;
    user: string;
    status: string;
    slug?: string;
  };
}

export interface UmbracoSpeaker extends UmbracoContentItem {
  contentType: 'speaker';
  properties: {
    speakerName: string;
    role: string;
    node: string;
    status: string;
    handle: string;
    image?: Array<any>; // Media picker returns an array
    imageUrl?: string; // Legacy support
    bio?: string;
    clearanceLevel?: string;
    slug?: string;
  };
}

export interface UmbracoProject extends UmbracoContentItem {
  contentType: 'project';
  properties: {
    title: string;
    author: string;
    description: string;
    link?: string;
    client?: string;
    category: string;
    techStack?: string[];
    image?: Array<any>; // Media picker returns an array
    imageUrl?: string; // Legacy support
    slug?: string;
  };
}

/**
 * Preserved types from React design (for compatibility)
 */
export interface Thread {
  id: string;
  category: string;
  timestamp: string;
  title: string;
  user: string;
  status: string;
}

export interface Event {
  id: string;
  category: string;
  timestamp: string;
  title: string;
  user: string;
  status: string;
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  node: string;
  status: string;
  handle: string;
  imageUrl?: string;
  bio?: string;
  clearanceLevel?: string;
}

export interface SystemLog {
  timestamp: string;
  level: string;
  message: string;
}

export interface ResourceStat {
  label: string;
  value: string;
  unit?: string;
}

