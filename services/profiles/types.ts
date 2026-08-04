export type ProfileCountry = 'US' | 'CA' | 'GB' | 'DE' | 'FR';

export interface DisplayProfile {
  id: string;
  firstName: string;
  lastName: string;
  displayEmail: string;
  city: string;
  mobileLast4: string;
  country: ProfileCountry;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProfileInput {
  firstName: string;
  lastName?: string;
  displayEmail?: string;
  city?: string;
  mobileLast4?: string;
  country: ProfileCountry;
  isDefault?: boolean;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  displayEmail?: string;
  city?: string;
  mobileLast4?: string;
  country?: ProfileCountry;
  isDefault?: boolean;
}
