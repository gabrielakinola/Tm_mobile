export type ProfileCountry = 'US' | 'CA' | 'GB' | 'DE' | 'FR';

export interface DisplayProfile {
  id: string;
  firstName: string;
  lastName: string;
  displayEmail: string;
  city: string;
  mobileLast4: string;
  country: ProfileCountry;
  preferredCategoryIds: string[];
  preferredGenreIds: string[];
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
  preferredCategoryIds?: string[];
  preferredGenreIds?: string[];
  isDefault?: boolean;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  displayEmail?: string;
  city?: string;
  mobileLast4?: string;
  country?: ProfileCountry;
  preferredCategoryIds?: string[];
  preferredGenreIds?: string[];
  isDefault?: boolean;
}
