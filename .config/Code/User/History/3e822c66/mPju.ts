import { TCountryCode } from '@/lib/hooks/useRegion';
import { TFile } from '@/lib/utils/file-utils';

export interface TSession {
  isMFAEnabled: boolean;
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  account: IAccount;
  stores: ISellerStore[];
}

export interface IAccount {
  _id: string;
  fullName: string;
  gender: string;
  dob: string;
  accountID: string;
  email: string;
  phoneNumber: string;
  dialCode: string;
  isMfaEnabled: boolean;
  mfaType: string;
  lastActivity: string;
  createdAt: string;
  updatedAt: string;
  id: string;
  whatsappNumber: string | undefined;
  emailVerified: boolean;
  roles: string;
}

export interface ISellerStore {
  _id: string;
  storeID: string;
  country: TCountryCode;
  kycStatus: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  storeName: string;
  storeURL: string;
  logo?: TFile;
  status: 'ACTIVE' | 'INACTIVE';
  storeType: string;
  isVerified: boolean;
}

export interface TSubscription {
  activeSubscription: ActiveSubscription | null;
  listingCount: number;
}

export interface ActiveSubscription {
  _id: string;
  subscriptionID: string;
  store: string;
  startDate: string;
  endDate: string;
  subscriptionDetails: SubscriptionDetails;
  subscriptionHistory: any;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface SubscriptionDetails {
  price: number;
  currency: string;
  frequency: string;
  limits: Limits;
  subscription: string;
}

export interface Limits {
  listing: number;
  leads: number;
  featuredProjects: number;
  calls: number;
  emails: number;
  chats: number;
  websiteVisits: number;
  catalogs: number;
  socialVisits: number;
}
