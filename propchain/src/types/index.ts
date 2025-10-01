export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: 'house' | 'apartment' | 'condo' | 'townhouse';
  status: 'for-sale' | 'for-rent' | 'sold' | 'rented';
  images: string[];
  description: string;
  features: string[];
  yearBuilt: number;
  parking: number;
  isNFT?: boolean;
  walletAddress?: string;
  favorited?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  walletConnected: boolean;
  walletAddress?: string;
  favorites: string[];
  savedSearches: SavedSearch[];
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: PropertyFilters;
  createdAt: string;
}

export interface PropertyFilters {
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  type?: string;
  status?: string;
  location?: string;
}

// Minimal typing for the injected Ethereum provider (e.g., MetaMask)
export interface EthereumProvider {
  isMetaMask?: boolean;
  request: (args: { method: string; params?: unknown[] }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  removeListener?: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider;
  }
}