export type Language = 'en' | 'hi';

export interface User {
  id: string;
  fullName: string;
  email: string;
  businessName: string;
  businessCategory: string;
  subscriptionPlan: 'free' | 'starter' | 'growth';
  createdAt: string;
}

export interface BusinessSettings {
  userId: string;
  businessName: string;
  businessCategory: string;
  ownerName: string;
  phone?: string;
  address?: string;
  preferredLanguage: Language;
  brandPrimaryColor: string;
  brandSecondaryColor: string;
  lowStockThreshold: number;
}

export type ClothingCategory =
  | 'Sarees & Ethnic'
  | 'Kurtis & Suits'
  | "Men's Shirts & Kurta"
  | "T-Shirts & Jeans"
  | 'Dresses & Western'
  | "Kids' Wear"
  | 'Fabrics & Unstitched'
  | 'Winterwear'
  | 'Accessories & Dupattas';

export interface Product {
  id: string;
  userId: string;
  name: string;
  category: ClothingCategory | string;
  sku: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  sizes: string[]; // e.g. ["S", "M", "L", "XL", "Free Size"]
  colour: string;
  description: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type MarketingPlatform = 'Instagram' | 'WhatsApp' | 'Facebook' | 'General';
export type MarketingTone = 'Professional' | 'Friendly' | 'Trendy' | 'Festive' | 'Premium';

export interface MarketingContentRequest {
  productName: string;
  category: string;
  price: number;
  discount?: string;
  targetAudience?: string;
  platform: MarketingPlatform;
  language: Language;
  tone: MarketingTone;
  shopName?: string;
}

export interface MarketingContentResponse {
  headline: string;
  caption: string;
  highlights: string[];
  callToAction: string;
  hashtags: string[];
  rawText?: string;
}

export interface InstagramCaptionRequest {
  productName: string;
  price: number;
  description?: string;
  discount?: string;
  targetAudience?: string;
  language: Language;
  captionStyle: 'Trendy' | 'Festive' | 'Minimalist' | 'Storytelling' | 'Offer-Focused';
}

export interface InstagramCaptionResponse {
  variations: {
    title: string;
    caption: string;
  }[];
  hook: string;
  callToAction: string;
  hashtags: string[];
}

export interface WhatsAppPromotionRequest {
  productName: string;
  price: number;
  discount?: string;
  expiryDate?: string;
  language: Language;
  messageStyle: 'Direct & Urgent' | 'Friendly & Warm' | 'Festive Celebration' | 'VIP Customer Special';
  shopName?: string;
  phone?: string;
}

export interface WhatsAppPromotionResponse {
  message: string;
  highlights: string[];
  callToAction: string;
}

export interface SavedContent {
  id: string;
  userId: string;
  contentType: 'marketing' | 'instagram' | 'whatsapp' | 'poster';
  title: string;
  inputDetails: Record<string, any>;
  content: string;
  tags?: string[];
  createdAt: string;
}

export interface PosterData {
  template: 'new_arrival' | 'festive_offer' | 'seasonal_sale' | 'clearance' | 'special_discount';
  shopName: string;
  productName: string;
  headline: string;
  subheadline?: string;
  price: number;
  originalPrice?: number;
  discountTag: string;
  contactNumber: string;
  addressOrWebsite: string;
  primaryColor: string;
  accentColor: string;
  imageUrl?: string;
  badgeText?: string;
}
