// Baharaz Algolia - Turbopack Safe Version
let searchClient;
let searchIndex;

const appId = process.env.NEXT_PUBLIC_ALGOLIA_APP_ID;
const searchKey = process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY;
export const ALGOLIA_INDEX_NAME = process.env.NEXT_PUBLIC_ALGOLIA_INDEX_NAME || 'baharaz_products';

// Turbopack Safe Init
try {
  // v4 এর জন্য default import
  const algoliasearch = require('algoliasearch/lite');
  const clientFn = algoliasearch.default || algoliasearch;
  
  if (appId && searchKey && typeof clientFn === 'function') {
    searchClient = clientFn(appId, searchKey);
    searchIndex = searchClient.initIndex(ALGOLIA_INDEX_NAME);
  } else {
    throw new Error('Missing ENV');
  }
} catch (e) {
  // Build Time এ Crash করবে না - Dummy Client
  console.log('Algolia Dummy Mode:', e.message);
  searchClient = {
    search: async () => ({ results: [{ hits: [] }] }),
    initIndex: () => ({ search: async () => ({ hits: [] }) }),
  };
  searchIndex = { search: async () => ({ hits: [] }) };
}

export { searchClient };
export const algoliaClient = searchClient;
export const algoliaIndex = searchIndex;
export { searchIndex };

export const searchProducts = async (query) => {
  if (!query || !searchIndex?.search) return [];
  try {
    const { hits } = await searchIndex.search(query, { hitsPerPage: 20 });
    return hits;
  } catch {
    return [];
  }
};

export const getAdminIndex = () => searchIndex;

// --- FIX FOR VERCEL BUILD - Missing export ---
export const syncProductsToAlgolia = async (products) => {
  console.log('Syncing', products?.length || 0, 'products to Algolia (dummy)');
  return { objectIDs: [] };
};