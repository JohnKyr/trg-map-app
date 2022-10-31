export interface TrgLocation {
  id?: number;
  latitude: number;
  longitude: number;
  name: string;
}

export interface TrgLocationResponse {
  id?: number;
  coordinates: number[];
  name: string;
}

export interface TrgLocationSort {
  _sort: 'name' | 'latitude' | 'longitude';
  _order: 'asc' | 'desc';
}

export interface LocationFormData {
  location: TrgLocation;
  action: string;
}

export const LIMIT_LOW = 5;
export const LIMIT_MID = 10;
export const LIMIT_HIGH = 15;
export const LIMITS = [LIMIT_LOW, LIMIT_MID, LIMIT_HIGH];
export const DEFAULT_SEARCH = '';
export const DEFAULT_LIMIT = LIMIT_MID;
export const DEFAULT_PAGE = 1;
