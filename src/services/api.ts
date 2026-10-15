import {
  User,
  Product,
  BusinessSettings,
  SavedContent,
  MarketingContentRequest,
  MarketingContentResponse,
  InstagramCaptionRequest,
  InstagramCaptionResponse,
  WhatsAppPromotionRequest,
  WhatsAppPromotionResponse,
} from '../types';

const TOKEN_KEY = 'vyapar_auth_token';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const removeStoredToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  async register(body: {
    fullName: string;
    businessName: string;
    email: string;
    password: string;
    businessCategory: string;
  }): Promise<{ token: string; user: User }> {
    const res = await apiFetch<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    setStoredToken(res.token);
    return res;
  },

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await apiFetch<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(res.token);
    return res;
  },

  async getMe(): Promise<{ user: User }> {
    return apiFetch<{ user: User }>('/api/auth/me');
  },

  async logout(): Promise<void> {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } finally {
      removeStoredToken();
    }
  },

  // Products
  async getProducts(): Promise<{ products: Product[] }> {
    return apiFetch<{ products: Product[] }>('/api/products');
  },

  async createProduct(product: Partial<Product>): Promise<{ product: Product }> {
    return apiFetch<{ product: Product }>('/api/products', {
      method: 'POST',
      body: JSON.stringify(product),
    });
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<{ product: Product }> {
    return apiFetch<{ product: Product }>(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  async deleteProduct(id: string): Promise<{ success: boolean }> {
    return apiFetch<{ success: boolean }>(`/api/products/${id}`, {
      method: 'DELETE',
    });
  },

  // Settings
  async getSettings(): Promise<{ settings: BusinessSettings }> {
    return apiFetch<{ settings: BusinessSettings }>('/api/settings');
  },

  async updateSettings(settings: Partial<BusinessSettings>): Promise<{ settings: BusinessSettings }> {
    return apiFetch<{ settings: BusinessSettings }>('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },

  // Content
  async getSavedContent(): Promise<{ contents: SavedContent[] }> {
    return apiFetch<{ contents: SavedContent[] }>('/api/content');
  },

  async saveContent(content: {
    contentType: 'marketing' | 'instagram' | 'whatsapp' | 'poster';
    title: string;
    inputDetails: Record<string, any>;
    content: string;
  }): Promise<{ content: SavedContent }> {
    return apiFetch<{ content: SavedContent }>('/api/content', {
      method: 'POST',
      body: JSON.stringify(content),
    });
  },

  async deleteSavedContent(id: string): Promise<{ success: boolean }> {
    return apiFetch<{ success: boolean }>(`/api/content/${id}`, {
      method: 'DELETE',
    });
  },

  // AI Generators
  async generateMarketing(payload: MarketingContentRequest): Promise<{ data: MarketingContentResponse; isFallback?: boolean; notice?: string }> {
    return apiFetch<{ data: MarketingContentResponse; isFallback?: boolean; notice?: string }>('/api/ai/marketing', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async generateInstagram(payload: InstagramCaptionRequest): Promise<{ data: InstagramCaptionResponse; isFallback?: boolean }> {
    return apiFetch<{ data: InstagramCaptionResponse; isFallback?: boolean }>('/api/ai/instagram', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  async generateWhatsApp(payload: WhatsAppPromotionRequest): Promise<{ data: WhatsAppPromotionResponse; isFallback?: boolean }> {
    return apiFetch<{ data: WhatsAppPromotionResponse; isFallback?: boolean }>('/api/ai/whatsapp', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
