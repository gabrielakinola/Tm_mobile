export type ProfileCountry = 'US' | 'CA' | 'GB' | 'DE' | 'FR';

export interface DisplayProfile {
  id: string;
  displayName: string;
  displayEmail: string;
  city: string;
  mobileLast4: string;
  country: ProfileCountry;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileInput {
  displayName: string;
  displayEmail?: string;
  city?: string;
  mobileLast4?: string;
  country: ProfileCountry;
  isDefault?: boolean;
}

export interface UpdateProfileInput {
  displayName?: string;
  displayEmail?: string;
  city?: string;
  mobileLast4?: string;
  country?: ProfileCountry;
  isDefault?: boolean;
}
