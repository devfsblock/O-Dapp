// UserType.ts
export type UserType = 'submitter' | 'labeler' | 'validator';

export interface UserPreferences {
  price?: boolean;
  features?: boolean;
  security?: boolean;
  email?: boolean;
  reward?: boolean;
}

export interface UserSocials {
  x: string;
  telegram: string;
}

export interface UserProfile {
  id?: string; // Firestore doc id
  username: string;
  walletAddress: string;
  userType: UserType;
  email?: string;
  preferences?: UserPreferences;
  socials: UserSocials;
  picture?: string;
}
