export interface FeatureCatalogItem {
  _id: string;
  name: string;
  emoji?: string;
  iconUrl?: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface CreateFeaturePayload {
  name?: string;
  emoji?: string;
  icon?: File;
}

export interface UpdateFeaturePayload {
  name?: string;
  emoji?: string;
  icon?: File;
}
