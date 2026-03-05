export interface FeatureCatalogItem {
  _id: string;
  name: string;
  iconUrl: string;
  createdAt?: number;
  updatedAt?: number;
}

export interface CreateFeaturePayload {
  name: string;
  icon: File;
}

export interface UpdateFeaturePayload {
  name?: string;
  icon?: File;
}
