export interface PropertyImageItem {
  id: string;
  url: string;
}

export interface PricingRule {
  nombre: string;
  fechaDesde: string;
  fechaHasta: string;
  valorUnico: number;
  activa: boolean;
}

export interface Catalog {
  _id: string;
  id?: string;
  name: string;
  isDefault: boolean;
  order: number;
  whatsappCatalogId?: string;
  createdAt: number;
  updatedAt: number;
}

export interface PropertyResponse {
  _id: string;
  id: string;
  title: string;
  description: string;
  location: string;
  capacity: number;
  category?: string;
  type?: string;
  code?: string;
  priceBase?: number;
  priceBaja?: number;
  priceMedia?: number;
  priceAlta?: number;
  priceOriginal?: number;
  pricing?: PricingRule[];
  price: number;
  images: string[];
  imageItems?: PropertyImageItem[];
  features: string[];
  video?: string;
  lat?: number;
  lng?: number;
  catalogIds?: string[];
  featureIds?: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  seasonPrices?: {
    base: number;
    baja: number;
    media: number;
    alta: number;
    rules: PricingRule[];
  };
  rating: number;
  reviewsCount: number;
  isFavorite?: boolean;
  isNew?: boolean;
  visible?: boolean;
  reservable?: boolean;
  createdAt?: number;
  updatedAt?: number;
  _creationTime?: number;
}

export interface PaginatedResponse<T> {
  hasMore: boolean;
  properties: T[];
  nextCursor?: string | null;
  data?: T[];
  total?: number;
}

export interface PropertiesParams {
  limit?: number;
  location?: string;
  minCapacity?: number;
  type?: string;
  category?: string;
  maxPrice?: number;
  cursor?: string;
}

export interface UpdatePropertyPayload {
  title?: string;
  description?: string;
  location?: string;
  capacity?: number;
  price?: number;
  code?: string;
  type?: string;
  category?: string;
  priceBase?: number;
  priceBaja?: number;
  priceMedia?: number;
  priceAlta?: number;
  priceOriginal?: number;
  isFavorite?: boolean;
  pricing?: PricingRule[];
  lat?: number;
  lng?: number;
  catalogIds?: string[];
  featureIds?: string[];
  features?: string[];
  video?: string;
  images?: string[];
  imageItems?: PropertyImageItem[];
  coordinates?: {
    lat: number;
    lng: number;
  };
  visible?: boolean;
  reservable?: boolean;
  seasonPrices?: {
    base: number;
    baja: number;
    media: number;
    alta: number;
    rules: PricingRule[];
  };
  files?: File[];
  videoFile?: File;
}
