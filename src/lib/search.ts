import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/pages/Products";

interface SearchResult extends Product {
  rank: number;
}

/**
 * Calculate similarity between two strings (for typo tolerance)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  if (s1 === s2) return 1;
  if (s1.includes(s2) || s2.includes(s1)) return 0.8;
  
  // Simple Levenshtein-like similarity
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1.0;
  
  const costs = [];
  for (let i = 0; i <= longer.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= shorter.length; j++) {
      if (i === 0) {
        costs[j] = j;
      } else if (j > 0) {
        let newValue = costs[j - 1];
        if (longer.charAt(i - 1) !== shorter.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
        }
        costs[j - 1] = lastValue;
        lastValue = newValue;
      }
    }
    if (i > 0) costs[shorter.length] = lastValue;
  }
  
  return 1 - costs[shorter.length] / longer.length;
}

/**
 * Rank search results based on relevance
 */
function rankResults(products: Product[], query: string): SearchResult[] {
  const searchTerms = query.toLowerCase().split(' ').filter(t => t.length > 0);
  
  return products.map(product => {
    let rank = 0;
    const productName = product.product_name.toLowerCase();
    const sku = product.sku.toLowerCase();
    const description = (product.description || '').toLowerCase();
    const category = product.category.toLowerCase();
    
    searchTerms.forEach(term => {
      // Exact name match (highest priority)
      if (productName === term) rank += 100;
      else if (productName.includes(term)) rank += 50;
      
      // Name similarity (typo tolerance)
      const nameSimilarity = calculateSimilarity(productName, term);
      if (nameSimilarity > 0.7) rank += nameSimilarity * 30;
      
      // SKU match (high priority)
      if (sku === term) rank += 80;
      else if (sku.includes(term)) rank += 40;
      
      // Category match
      if (category.includes(term)) rank += 30;
      
      // Description match (lower priority)
      if (description.includes(term)) rank += 10;
      
      // Word boundaries bonus
      const wordBoundaryRegex = new RegExp(`\\b${term}`, 'i');
      if (wordBoundaryRegex.test(productName)) rank += 20;
      if (wordBoundaryRegex.test(description)) rank += 5;
    });
    
    return { ...product, rank };
  }).filter(p => p.rank > 0)
    .sort((a, b) => b.rank - a.rank);
}

/**
 * Search products with intelligent ranking and typo tolerance
 */
export async function searchProducts(query: string): Promise<Product[]> {
  if (!query || query.trim().length === 0) {
    return [];
  }

  try {
    // Fetch all active products (with caching considerations)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);

    if (error) throw error;
    
    // Rank and filter results
    const rankedResults = rankResults(data || [], query);
    
    // Return top results (remove rank field)
    return rankedResults.map(({ rank, ...product }) => product);
  } catch (error) {
    console.error('Search error:', error);
    return [];
  }
}

/**
 * Get autocomplete suggestions (limited to 10)
 */
export async function getAutocompleteSuggestions(query: string): Promise<Product[]> {
  const results = await searchProducts(query);
  return results.slice(0, 10);
}

/**
 * Save search query for analytics
 */
export async function logSearch(query: string, userId?: string): Promise<void> {
  // TODO: Implement search analytics logging
  console.log('Search logged:', { query, userId, timestamp: new Date() });
}

/**
 * Get recent searches for a user
 */
export function getRecentSearches(userId: string): string[] {
  // Use localStorage for recent searches
  try {
    const recent = localStorage.getItem(`recent_searches_${userId}`);
    return recent ? JSON.parse(recent) : [];
  } catch {
    return [];
  }
}

/**
 * Save recent search
 */
export function saveRecentSearch(query: string, userId?: string): void {
  if (!userId) return;
  
  try {
    const key = `recent_searches_${userId}`;
    const recent = getRecentSearches(userId);
    const updated = [query, ...recent.filter(q => q !== query)].slice(0, 5);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving recent search:', error);
  }
}

/**
 * Clear recent searches
 */
export function clearRecentSearches(userId: string): void {
  try {
    localStorage.removeItem(`recent_searches_${userId}`);
  } catch (error) {
    console.error('Error clearing recent searches:', error);
  }
}

/**
 * Popular/trending searches (mock data for MVP)
 */
export const popularSearches = [
  'Thermometer',
  'Beaker',
  'Surgical Kit',
  'Microscope',
  'Test Tubes',
  'Stethoscope',
];
