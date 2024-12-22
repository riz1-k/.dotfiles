export interface TProducts {
  _id: string;
  store: Store;
  title: string;
  highlights: string[];
  paymentMethods: string[];
  images: Image[];
  faqs: Faq[];
  description: string;
  price: number;
  pricingType: string;
  catalogs: Catalog[];
  id: string;
  avgRating: number;
  reviews: number;
  avgStoreRating: number;
  storeReviews: number;
  isLeadsAvailable: boolean;
  isEmailsAvailable: boolean;
  isCallsAvailable: boolean;
  isChatsAvailable: boolean;
  isWebsiteVisitsAvailable: boolean;
  isSocialVisitsAvailable: boolean;
}

export interface Store {
  _id: string;
  storeName: string;
  storeURL: string;
  logo: Logo;
  storeType: string;
  storeData: StoreData;
}

export interface Logo {
  _id: string;
  src: string;
  fileType: string;
  purpose: string;
  isUsed: boolean;
  meta: Meta;
}

export interface Meta {
  fileName: string;
  fileSize: number;
}

export interface StoreData {
  _id: string;
  about: string;
  contactInfo: ContactInfo[];
  highlights: Highlights;
  specialities: string[];
  howCanWeHelp: string[];
  businessEmail: string | undefined;
  businessPhone: string | undefined;
}

export interface ContactInfo {
  fieldType: string;
  type: string;
  value: string;
}

export interface Highlights {
  flexiblePricing: boolean;
  emergencyService: boolean;
  matchPrice: boolean;
  workGuarantee: boolean;
  establishmentYear: number;
  noOfEmployees: number;
  smse: boolean;
}

export interface Image {
  _id: string;
  src: string;
}

export interface Faq {
  question: string;
  answer: string;
}

export interface Catalog {
  _id: string;
  listing: string;
  catalogType: string;
  catalogMedia: CatalogMedia;
  isEnabled: boolean;
}

export interface CatalogMedia {
  _id: string;
  src: string;
  meta: Meta2;
}

export interface Meta2 {
  fileName: string;
  fileSize: number;
}
