// types.d.ts
export interface Property {
    id: string;
    title: string;
    address: string;
    price: number;
    images: string[];
    isLiked?: boolean;
}


// types/scraper.ts
export interface Listing {
    address: string;
    propertyType: string;
    price: string;
    beds: string;
    imgs: string[];
    link: string;
    phone: string;
    emailButtonText: string;
    datePosted: string;
    source?: string;
}

export interface ApiResponse {
    success: boolean;
    count: number;
    listings: Listing[];
    location: string;
    cached?: boolean;
    cacheAge?: number;
    method?: string;
    timestamp?: string;
    error?: string;
    detail?: string;
}

export interface CacheItem {
    data: ApiResponse;
    timestamp: number;
}
