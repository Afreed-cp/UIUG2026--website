/**
 * Block List Renderer
 * Renders Umbraco Block List content dynamically
 * 
 * Umbraco Delivery API v2 returns Block Lists in this structure:
 * {
 *   items: [
 *     {
 *       content: {
 *         contentType: "heroBlock",
 *         id: "guid",
 *         properties: { ... }
 *       },
 *       settings: null | { ... }
 *     }
 *   ]
 * }
 */

export interface BlockContent {
  contentType: string;
  id: string;
  properties: Record<string, any>;
}

export interface BlockItem {
  content: BlockContent;
  settings: any | null;
}

export interface BlockListData {
  items: BlockItem[];
}

export interface BlockListItem {
  contentType: string;
  id: string;
  properties: Record<string, any>;
}

/**
 * Get all blocks in order from Block List
 * The Delivery API returns blocks already in order
 */
export function getBlocksInOrder(blockListData: BlockListData): BlockListItem[] {
  if (!blockListData?.items || !Array.isArray(blockListData.items)) {
    return [];
  }
  
  return blockListData.items.map((item) => ({
    contentType: item.content.contentType,
    id: item.content.id,
    properties: item.content.properties || {},
  }));
}

/**
 * Get block content type alias from contentType
 */
export function getBlockTypeAlias(block: BlockListItem): string {
  return block.contentType || 'unknownBlock';
}

