import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const app = express();
app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI SDK per system skill
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Database directory & persistent file
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

interface DatabaseSchema {
  users: Array<{
    id: string;
    fullName: string;
    email: string;
    passwordHash: string;
    salt: string;
    businessName: string;
    businessCategory: string;
    subscriptionPlan: 'free' | 'starter' | 'growth';
    createdAt: string;
  }>;
  sessions: Array<{
    token: string;
    userId: string;
    createdAt: string;
  }>;
  products: Array<{
    id: string;
    userId: string;
    name: string;
    category: string;
    sku: string;
    price: number;
    originalPrice?: number;
    quantity: number;
    sizes: string[];
    colour: string;
    description: string;
    imageUrl?: string;
    createdAt: string;
    updatedAt: string;
  }>;
  generatedContent: Array<{
    id: string;
    userId: string;
    contentType: 'marketing' | 'instagram' | 'whatsapp' | 'poster';
    title: string;
    inputDetails: Record<string, any>;
    content: string;
    createdAt: string;
  }>;
  settings: Record<
    string,
    {
      userId: string;
      businessName: string;
      businessCategory: string;
      ownerName: string;
      phone?: string;
      address?: string;
      preferredLanguage: 'en' | 'hi';
      brandPrimaryColor: string;
      brandSecondaryColor: string;
      lowStockThreshold: number;
    }
  >;
}

// Helpers for password hashing
function hashPassword(password: string, salt?: string) {
  const generatedSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, generatedSalt, 1000, 64, 'sha512').toString('hex');
  return { hash, salt: generatedSalt };
}

function verifyPassword(password: string, hash: string, salt: string) {
  const check = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return check === hash;
}

// Load and save DB
function getDB(): DatabaseSchema {
  if (!fs.existsSync(DB_FILE)) {
    // Initial Seed Data with Indian fashion shop
    const demoSalt = crypto.randomBytes(16).toString('hex');
    const demoHash = crypto.pbkdf2Sync('password123', demoSalt, 1000, 64, 'sha512').toString('hex');
    const demoUserId = 'user_demo_101';
    const demoToken = 'vyapar_demo_token_2026';

    const initialDB: DatabaseSchema = {
      users: [
        {
          id: demoUserId,
          fullName: 'Rajesh Sharma',
          email: 'demo@vyaparai.in',
          passwordHash: demoHash,
          salt: demoSalt,
          businessName: 'Shree Ganesh Fashion Hub',
          businessCategory: "Women's & Men's Ethnic Wear",
          subscriptionPlan: 'starter',
          createdAt: new Date().toISOString(),
        },
      ],
      sessions: [
        {
          token: demoToken,
          userId: demoUserId,
          createdAt: new Date().toISOString(),
        },
      ],
      products: [
        {
          id: 'prod_1',
          userId: demoUserId,
          name: 'Pure Banarasi Silk Zari Saree',
          category: 'Sarees & Ethnic',
          sku: 'BNS-SLK-01',
          price: 2499,
          originalPrice: 3999,
          quantity: 14,
          sizes: ['Free Size'],
          colour: 'Royal Peacock Blue',
          description: 'Handwoven soft Banarasi silk saree with grand golden zari border and matching unstitched blouse piece. Perfect for festive celebrations and wedding ceremonies.',
          imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
          createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        },
        {
          id: 'prod_2',
          userId: demoUserId,
          name: 'Chanderi Embroidered Anarkali Kurti Set',
          category: 'Kurtis & Suits',
          sku: 'CHK-ARK-02',
          price: 1850,
          originalPrice: 2800,
          quantity: 4, // Low stock!
          sizes: ['M', 'L', 'XL'],
          colour: 'Dusty Rose Pink',
          description: 'Premium Chanderi cotton floor-length anarkali kurti with intricate mirror and thread embroidery, matched with silk dupatta.',
          imageUrl: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
          createdAt: new Date(Date.now() - 4 * 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        },
        {
          id: 'prod_3',
          userId: demoUserId,
          name: "Men's Pure Linen Mandarin Collar Shirt",
          category: "Men's Shirts & Kurta",
          sku: 'MLN-MND-03',
          price: 1299,
          originalPrice: 1999,
          quantity: 22,
          sizes: ['38', '40', '42', '44'],
          colour: 'Sage Green',
          description: '100% breathable organic French flax linen casual shirt. Comfortable summer wear, stylish wooden finish buttons.',
          imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80',
          createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        },
        {
          id: 'prod_4',
          userId: demoUserId,
          name: 'Cotton Printed Daily Wear Kurti',
          category: 'Kurtis & Suits',
          sku: 'CPK-DLY-04',
          price: 599,
          originalPrice: 999,
          quantity: 2, // Low stock alert!
          sizes: ['S', 'M', 'L', 'XXL'],
          colour: 'Mustard Yellow',
          description: 'Soft Jaipuri block print 100% cotton straight kurti with side slits and pocket. Easy machine wash, all-day comfort.',
          imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
          createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        },
        {
          id: 'prod_5',
          userId: demoUserId,
          name: "Men's Festive Silk Blend Kurta Pajama Set",
          category: "Men's Shirts & Kurta",
          sku: 'MKP-FST-05',
          price: 1799,
          originalPrice: 2499,
          quantity: 8,
          sizes: ['M', 'L', 'XL'],
          colour: 'Maroon Gold',
          description: 'Traditional Indian silk blend kurta with self-weaving pattern and churidar pajama. Ideal for Diwali, Eid, and family functions.',
          imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
          createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        },
        {
          id: 'prod_6',
          userId: demoUserId,
          name: 'Floral Georgette Maxi Dress',
          category: 'Dresses & Western',
          sku: 'FGM-WST-06',
          price: 1199,
          originalPrice: 1799,
          quantity: 0, // Out of stock!
          sizes: ['S', 'M', 'L'],
          colour: 'Lavender Floral',
          description: 'Tiered flowy georgette western dress with elasticated waist and flared sleeves. Perfect for casual outings and parties.',
          imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
          createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
          updatedAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        },
      ],
      generatedContent: [
        {
          id: 'gen_1',
          userId: demoUserId,
          contentType: 'instagram',
          title: 'Banarasi Silk Saree Launch Post',
          inputDetails: {
            productName: 'Pure Banarasi Silk Zari Saree',
            price: 2499,
            style: 'Festive',
          },
          content: `👑 Royal elegance redefined! Bring timeless Indian heritage into your festive wardrobe with our Pure Banarasi Silk Zari Saree in Royal Peacock Blue. ✨\n\n💰 Special Festive Price: ₹2,499 (Flat 38% OFF!)\n📦 Includes matching designer blouse piece\n🚚 Cash on Delivery available all over India!\n\n👇 Drop a 'BUY' in the comments or WhatsApp us directly at +91 98765 43210 to book yours before stock ends!\n\n#BanarasiSaree #IndianEthnicWear #FestiveCollection #SareeLove #VocalForLocal #ShreeGaneshFashion`,
          createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        },
        {
          id: 'gen_2',
          userId: demoUserId,
          contentType: 'whatsapp',
          title: 'Weekend Flash Sale Kurti Broadcast',
          inputDetails: {
            productName: 'Cotton Printed Daily Wear Kurti',
            price: 599,
            discount: 'Flat 40% OFF',
          },
          content: `🌟 *WEEKEND SPECIAL OFFER from Shree Ganesh Fashion Hub!* 🌟\n\nNamaste dear customer! 🙏\nUpgrade your daily comfort with our bestselling *Jaipuri 100% Cotton Printed Kurtis*.\n\n✨ *Why you will love it:*\n• Pure breathable cotton\n• Fast vibrant colors (no bleeding)\n• Practical side pockets & smart straight fit\n\n🔥 *Offer Price:* Just *₹599* (MRP ₹999)\n⏳ *Offer valid till Sunday midnight only!*\n\n📍 Visit our shop at MG Road or reply to this message to order directly on WhatsApp!\n📞 WhatsApp: 9876543210`,
          createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        },
      ],
      settings: {
        [demoUserId]: {
          userId: demoUserId,
          businessName: 'Shree Ganesh Fashion Hub',
          businessCategory: "Women's & Men's Ethnic Wear",
          ownerName: 'Rajesh Sharma',
          phone: '+91 98765 43210',
          address: 'Shop No. 14, Main Market, MG Road, Jaipur',
          preferredLanguage: 'en',
          brandPrimaryColor: '#1e1b4b',
          brandSecondaryColor: '#7c3aed',
          lowStockThreshold: 5,
        },
      },
    };

    fs.writeFileSync(DB_FILE, JSON.stringify(initialDB, null, 2), 'utf-8');
    return initialDB;
  }

  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, restoring default', err);
    return { users: [], sessions: [], products: [], generatedContent: [], settings: {} };
  }
}

function saveDB(db: DatabaseSchema) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save DB file', err);
  }
}

// Authentication middleware
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    fullName: string;
    email: string;
    businessName: string;
    businessCategory: string;
    subscriptionPlan: 'free' | 'starter' | 'growth';
    createdAt: string;
  };
}

function authenticate(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  const db = getDB();
  const session = db.sessions.find((s) => s.token === token);

  if (!session) {
    return res.status(401).json({ error: 'Session expired or invalid. Please login again.' });
  }

  const user = db.users.find((u) => u.id === session.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found.' });
  }

  req.user = {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    businessName: user.businessName,
    businessCategory: user.businessCategory,
    subscriptionPlan: user.subscriptionPlan,
    createdAt: user.createdAt,
  };
  next();
}

// --- AUTH ROUTES ---

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { fullName, businessName, email, password, businessCategory } = req.body;

  if (!fullName || !businessName || !email || !password || !businessCategory) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  const db = getDB();
  const existingUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const { hash, salt } = hashPassword(password);
  const userId = 'user_' + crypto.randomBytes(8).toString('hex');
  const token = 'tok_' + crypto.randomBytes(24).toString('hex');

  const newUser = {
    id: userId,
    fullName,
    email: email.toLowerCase(),
    passwordHash: hash,
    salt,
    businessName,
    businessCategory,
    subscriptionPlan: 'free' as const,
    createdAt: new Date().toISOString(),
  };

  db.users.push(newUser);
  db.sessions.push({
    token,
    userId,
    createdAt: new Date().toISOString(),
  });

  // Default settings
  db.settings[userId] = {
    userId,
    businessName,
    businessCategory,
    ownerName: fullName,
    preferredLanguage: 'en',
    brandPrimaryColor: '#0f172a',
    brandSecondaryColor: '#6366f1',
    lowStockThreshold: 5,
  };

  saveDB(db);

  return res.status(201).json({
    token,
    user: {
      id: newUser.id,
      fullName: newUser.fullName,
      email: newUser.email,
      businessName: newUser.businessName,
      businessCategory: newUser.businessCategory,
      subscriptionPlan: newUser.subscriptionPlan,
      createdAt: newUser.createdAt,
    },
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const db = getDB();
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isValid = verifyPassword(password, user.passwordHash, user.salt);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = 'tok_' + crypto.randomBytes(24).toString('hex');
  db.sessions.push({
    token,
    userId: user.id,
    createdAt: new Date().toISOString(),
  });
  saveDB(db);

  return res.json({
    token,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      businessName: user.businessName,
      businessCategory: user.businessCategory,
      subscriptionPlan: user.subscriptionPlan,
      createdAt: user.createdAt,
    },
  });
});

app.get('/api/auth/me', authenticate, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ user: req.user });
});

app.post('/api/auth/logout', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    const db = getDB();
    db.sessions = db.sessions.filter((s) => s.token !== token);
    saveDB(db);
  }
  return res.json({ success: true });
});

// --- PRODUCTS ROUTES ---

app.get('/api/products', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const db = getDB();
  const userProducts = db.products.filter((p) => p.userId === req.user!.id);
  return res.json({ products: userProducts });
});

app.post('/api/products', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { name, category, sku, price, originalPrice, quantity, sizes, colour, description, imageUrl } = req.body;

  if (!name || price === undefined || quantity === undefined) {
    return res.status(400).json({ error: 'Product name, price, and quantity are required.' });
  }

  const db = getDB();
  const newProduct = {
    id: 'prod_' + crypto.randomBytes(8).toString('hex'),
    userId: req.user!.id,
    name: String(name).trim(),
    category: category || 'General Clothing',
    sku: sku ? String(sku).trim() : 'SKU-' + Math.floor(1000 + Math.random() * 9000),
    price: Number(price),
    originalPrice: originalPrice ? Number(originalPrice) : undefined,
    quantity: Math.max(0, parseInt(String(quantity), 10) || 0),
    sizes: Array.isArray(sizes) ? sizes : sizes ? [sizes] : ['Free Size'],
    colour: colour ? String(colour).trim() : 'Standard',
    description: description ? String(description).trim() : '',
    imageUrl: imageUrl || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.products.unshift(newProduct);
  saveDB(db);

  return res.status(201).json({ product: newProduct });
});

app.put('/api/products/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const productId = req.params.id;
  const db = getDB();
  const index = db.products.findIndex((p) => p.id === productId && p.userId === req.user!.id);

  if (index === -1) {
    return res.status(404).json({ error: 'Product not found or access denied.' });
  }

  const current = db.products[index];
  const updated = {
    ...current,
    ...req.body,
    id: current.id,
    userId: current.userId,
    updatedAt: new Date().toISOString(),
  };

  db.products[index] = updated;
  saveDB(db);

  return res.json({ product: updated });
});

app.delete('/api/products/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const productId = req.params.id;
  const db = getDB();
  const initialLength = db.products.length;
  db.products = db.products.filter((p) => !(p.id === productId && p.userId === req.user!.id));

  if (db.products.length === initialLength) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  saveDB(db);
  return res.json({ success: true, message: 'Product deleted successfully.' });
});

// --- SETTINGS ROUTES ---

app.get('/api/settings', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const db = getDB();
  const userSettings = db.settings[req.user!.id] || {
    userId: req.user!.id,
    businessName: req.user!.businessName,
    businessCategory: req.user!.businessCategory,
    ownerName: req.user!.fullName,
    preferredLanguage: 'en',
    brandPrimaryColor: '#0f172a',
    brandSecondaryColor: '#6366f1',
    lowStockThreshold: 5,
  };
  return res.json({ settings: userSettings });
});

app.put('/api/settings', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const db = getDB();
  const current = db.settings[req.user!.id] || {
    userId: req.user!.id,
    businessName: req.user!.businessName,
    businessCategory: req.user!.businessCategory,
    ownerName: req.user!.fullName,
    preferredLanguage: 'en',
    brandPrimaryColor: '#0f172a',
    brandSecondaryColor: '#6366f1',
    lowStockThreshold: 5,
  };

  const updated = {
    ...current,
    ...req.body,
    userId: req.user!.id,
  };

  db.settings[req.user!.id] = updated;

  // Also update businessName on the user record if changed
  if (req.body.businessName) {
    const u = db.users.find((user) => user.id === req.user!.id);
    if (u) {
      u.businessName = req.body.businessName;
    }
  }

  saveDB(db);
  return res.json({ settings: updated });
});

// --- SAVED CONTENT ROUTES ---

app.get('/api/content', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const db = getDB();
  const contents = db.generatedContent.filter((c) => c.userId === req.user!.id);
  return res.json({ contents });
});

app.post('/api/content', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const { contentType, title, inputDetails, content } = req.body;
  if (!contentType || !title || !content) {
    return res.status(400).json({ error: 'Content type, title, and content body are required.' });
  }

  const db = getDB();
  const newContent = {
    id: 'gen_' + crypto.randomBytes(8).toString('hex'),
    userId: req.user!.id,
    contentType,
    title: String(title).trim(),
    inputDetails: inputDetails || {},
    content: String(content),
    createdAt: new Date().toISOString(),
  };

  db.generatedContent.unshift(newContent);
  saveDB(db);
  return res.status(201).json({ content: newContent });
});

app.delete('/api/content/:id', authenticate, (req: AuthenticatedRequest, res: Response) => {
  const contentId = req.params.id;
  const db = getDB();
  const initLen = db.generatedContent.length;
  db.generatedContent = db.generatedContent.filter((c) => !(c.id === contentId && c.userId === req.user!.id));

  if (db.generatedContent.length === initLen) {
    return res.status(404).json({ error: 'Content item not found.' });
  }

  saveDB(db);
  return res.json({ success: true });
});

// --- ROBUST MULTI-MODEL GEMINI GENERATION HELPER ---
async function generateWithGemini(
  prompt: string,
  systemInstruction: string,
  responseSchema?: any
): Promise<{ text: string; model: string }> {
  // Ordered sequence of capable models per gemini-api skill (flash-latest prioritizes active low-latency pool)
  const candidateModels = ['gemini-flash-latest', 'gemini-3.8-flash', 'gemini-3.1-flash-lite'];
  let lastError: any = null;

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          ...(responseSchema ? { responseSchema } : {}),
        },
      });

      if (response && response.text) {
        return { text: response.text, model };
      }
    } catch (err: any) {
      lastError = err;
      const status = err?.status || err?.code || '';
      console.warn(`[VyaparAI] Model ${model} encountered issue (${status}). Trying next candidate...`);
    }
  }

  throw lastError || new Error('All candidate Gemini models were temporarily busy.');
}

// --- AI MARKETING GENERATION ROUTES ---

app.post('/api/ai/marketing', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { productName, category, price, discount, targetAudience, platform, language, tone, shopName } = req.body;

  if (!productName || !price) {
    return res.status(400).json({ error: 'Product name and price are required.' });
  }

  const effectiveShop = shopName || req.user?.businessName || 'Our Fashion Boutique';
  const isHindi = language === 'hi';

  const systemInstruction = `You are VyaparAI, an expert Indian retail fashion marketing strategist and copywriter.
You help small clothing boutiques, saree stores, garment shops, and fashion retailers in India create high-converting, culturally attuned marketing content.
Language: ${isHindi ? 'Hindi (or natural Hinglish used in Indian commerce, fluent and engaging)' : 'English with natural Indian retail appeal'}.
Always include Indian Rupee (₹) pricing, festive or urgency cues, relatable styling advice, and clear calls to action.
Always return valid JSON matching the exact schema requested.`;

  const prompt = `Create a marketing campaign for:
Shop Name: ${effectiveShop}
Product: ${productName}
Category: ${category || 'Clothing'}
Price: ₹${price}
Special Offer/Discount: ${discount || 'Limited Period Offer'}
Target Audience: ${targetAudience || 'Fashion enthusiasts, shoppers looking for quality clothing'}
Platform: ${platform || 'Instagram'}
Tone: ${tone || 'Festive'}
Language: ${isHindi ? 'Hindi' : 'English'}

Provide:
1. headline: Catchy 1-line hook or offer banner
2. caption: Complete ready-to-post engaging caption or message formatted for ${platform}
3. highlights: 3 to 4 bullet points highlighting fabric quality, comfort, styling, or value
4. callToAction: Clear call to action (e.g., WhatsApp order, visit shop, DM to buy)
5. hashtags: 6 to 10 trending, relevant Indian fashion hashtags`;

  try {
    const aiResult = await generateWithGemini(prompt, systemInstruction);
    const rawText = aiResult.text.trim();
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(rawText);
    } catch {
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      parsedData = JSON.parse(cleaned);
    }

    return res.json({
      success: true,
      modelUsed: aiResult.model,
      data: {
        headline: parsedData.headline || `Exclusive: ${productName}`,
        caption: parsedData.caption || rawText,
        highlights: Array.isArray(parsedData.highlights) ? parsedData.highlights : ['Premium Quality', 'Best Price Guarantee', 'Fast Delivery'],
        callToAction: parsedData.callToAction || `Order on WhatsApp: Visit ${effectiveShop}`,
        hashtags: Array.isArray(parsedData.hashtags) ? parsedData.hashtags : ['#IndianFashion', '#EthnicWear', '#VyaparAI'],
        rawText,
      },
    });
  } catch (err: any) {
    console.error('Gemini API call error:', err);

    const fallbackHeadline = isHindi
      ? `✨ ${effectiveShop} का नया कलेक्शन: ${productName} मात्र ₹${price} में!`
      : `✨ Elevate Your Style with ${productName} — Only ₹${price} at ${effectiveShop}!`;

    const fallbackCaption = isHindi
      ? `नमस्ते! 🙏 अपनी वॉर्डरोब में लाएं नयापन। ${effectiveShop} पेश करते हैं प्रीमियम ${productName}।\n\n💰 विशेष ऑफर मूल्य: मात्र ₹${price} ${discount ? `(${discount})` : ''}\n✨ बेहतरीन कपड़ा, शानदार फिटिंग और आराम।\n\n📍 दुकान पर पधारें या सीधे व्हाट्सएप पर ऑर्डर करें!\n📞 संपर्क करें: अभी ऑर्डर बुक करें!`
      : `Looking for the perfect blend of style, comfort, and value? ${effectiveShop} presents the all-new ${productName}!\n\n🏷️ Special Offer: ₹${price} ${discount ? `(${discount})` : ''}\n💎 Premium fabric with flawless finishing\n🚚 Delivery available across India\n\n👇 Comment 'BUY' or WhatsApp us directly to claim this limited-stock offer!`;

    return res.json({
      success: true,
      isFallback: true,
      notice: 'Generated using VyaparAI retail template system.',
      data: {
        headline: fallbackHeadline,
        caption: fallbackCaption,
        highlights: isHindi
          ? ['प्रीमियम क्वालिटी कपड़ा', 'धोने में आसान और टिकाऊ रंग', 'त्योहारों और खास मौकों के लिए उपयुक्त']
          : ['Crafted from premium breathable fabric', 'Vibrant lasting colors & graceful fit', 'Ideal for daily elegance or festive occasions'],
        callToAction: isHindi ? `व्हाट्सएप पर संपर्क करें या ${effectiveShop} पधारें` : `DM to order or WhatsApp us today!`,
        hashtags: ['#IndianFashion', '#EthnicWear', '#BoutiqueStyle', '#ShopLocalIndia', '#OOTDIndia', '#KurtiLove'],
      },
    });
  }
});

app.post('/api/ai/instagram', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { productName, price, description, discount, targetAudience, language, captionStyle } = req.body;

  if (!productName || !price) {
    return res.status(400).json({ error: 'Product name and price are required.' });
  }

  const isHindi = language === 'hi';
  const effectiveStyle = captionStyle || 'Trendy';

  const systemInstruction = `You are a viral Instagram fashion marketing expert specializing in Indian retail apparel.
You generate 3 distinct caption variations (Storytelling, Trendy/Aesthetic, High-Urgency Sales), an opening hook line, call to action, and strategic Indian fashion hashtags.
Language: ${isHindi ? 'Hindi / Hinglish' : 'English'}.
Always format response as JSON with properties: variations (array of 3 objects with {title, caption}), hook (string), callToAction (string), hashtags (array of strings).`;

  const prompt = `Generate 3 Instagram captions for a clothing store:
Product: ${productName}
Price: ₹${price}
Description: ${description || 'Premium clothing item'}
Discount: ${discount || 'Special boutique pricing'}
Audience: ${targetAudience || 'Fashion lovers across India'}
Style: ${effectiveStyle}
Language: ${isHindi ? 'Hindi' : 'English'}`;

  try {
    const aiResult = await generateWithGemini(prompt, systemInstruction);
    const raw = aiResult.text.trim();
    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return res.json({
      success: true,
      modelUsed: aiResult.model,
      data: {
        variations: parsed.variations || [],
        hook: parsed.hook || `Stop scrolling! Look at this gorgeous ${productName} 🔥`,
        callToAction: parsed.callToAction || 'Tap the link in bio or DM us to order now!',
        hashtags: parsed.hashtags || ['#IndianFashion', '#OOTDIndia', '#EthnicWear', '#InstaFashionIndia'],
      },
    });
  } catch (err: any) {
    console.error('Instagram AI generation error:', err);

    return res.json({
      success: true,
      isFallback: true,
      data: {
        hook: isHindi ? `🔥 रुकिए! यह खूबसूरत ${productName} जरूर देखिए:` : `🔥 Stop scrolling! Meet your next favorite outfit: ${productName} ✨`,
        variations: [
          {
            title: isHindi ? 'ट्रेंडी और फैशनेबल' : 'Aesthetic & Trendy',
            caption: isHindi
              ? `जब स्टाइल और आराम दोनों मिल जाएं! ✨\n\nपेश है ${productName} — जिसे पहनकर आप दिखेंगे सबसे अलग।\n\n💰 कीमत: सिर्फ ₹${price} ${discount ? `(${discount})` : ''}\n📦 सीमित स्टॉक उपलब्ध!\n\n👇 अभी DM करें या बायो में दिए लिंक से ऑर्डर करें!`
              : `Obsessed with the details! 😍 Step out in effortless grace with our latest ${productName}.\n\n✨ Price: Just ₹${price} ${discount ? `(${discount})` : ''}\n✨ Designed for comfort & compliments\n\n🛍️ Tap the link in bio or send a DM to order today!`,
          },
          {
            title: isHindi ? 'कहानी और पारंपरिक अंदाज' : 'Storyteller / Heritage',
            caption: isHindi
              ? `भारतीय परंपरा और आधुनिक फैशन का अद्भुत संगम। 🌸\n\nहर अवसर को बनाएं यादगार हमारे ${productName} के साथ। प्रीमियम क्वालिटी जो पहली नजर में पसंद आ जाए।\n\n🔖 ऑफर प्राइस: ₹${price}\n📩 ऑर्डर के लिए तुरंत मैसेज करें।`
              : `True style never shouts, it speaks through pure quality. 🌿\n\nCrafted with love for Indian occasions, our ${productName} brings grace to every step you take.\n\nPrice: ₹${price} | Limited batch creation\nDrop a ❤️ if you love this look!`,
          },
          {
            title: isHindi ? 'सीमित स्टॉक ऑफर' : 'Urgent Flash Deal',
            caption: isHindi
              ? `⚡ फ्लैश सेल अलर्ट! ⚡\n\nहमारा सबसे ज्यादा बिकने वाला ${productName} दोबारा स्टॉक में है।\n\n💥 मात्र ₹${price} में! ${discount ? `छूट: ${discount}` : ''}\n⚠️ स्टॉक तेजी से खत्म हो रहा है, बाद में पछताना न पड़े।\n\n📲 तुरंत 'BUY' कमेंट करें या WhatsApp पर बात करें!`
              : `⚡ FLASH SALE ALERT! ⚡\n\nRestock of our highest-rated ${productName} is officially live!\n\n💸 Steal deal at ₹${price} ${discount ? `(${discount})` : ''}\n🚨 Only a few pieces left in stock.\n\n👉 Send a DM now before your size sells out!`,
          },
        ],
        callToAction: isHindi ? 'ऑर्डर करने के लिए तुरंत DM करें या व्हाट्सएप भेजें!' : 'Send us a DM or click the link in bio to order!',
        hashtags: ['#IndianFashion', '#ClothingBoutique', '#EthnicVibes', '#KurtiLover', '#FashionIndia', '#SareeStyle', '#ShopLocal'],
      },
    });
  }
});

app.post('/api/ai/whatsapp', authenticate, async (req: AuthenticatedRequest, res: Response) => {
  const { productName, price, discount, expiryDate, language, messageStyle, shopName, phone } = req.body;

  if (!productName || !price) {
    return res.status(400).json({ error: 'Product name and price are required.' });
  }

  const effectiveShop = shopName || req.user?.businessName || 'Our Fashion Boutique';
  const isHindi = language === 'hi';

  const systemInstruction = `You are an expert in WhatsApp marketing for Indian local retail shops.
WhatsApp messages for Indian customers must use proper WhatsApp formatting (*bold*, bullet points, emojis), be concise, trustworthy, polite (Namaste 🙏), and easy to read on mobile.
Language: ${isHindi ? 'Hindi' : 'English'}.
Return JSON with { message: string, highlights: string[], callToAction: string }.`;

  const prompt = `Draft a high-converting WhatsApp promotional broadcast:
Shop Name: ${effectiveShop}
Product: ${productName}
Price: ₹${price}
Discount: ${discount || 'Special customer offer'}
Expiry Date: ${expiryDate || 'Valid till Sunday'}
Style: ${messageStyle || 'Direct & Urgent'}
Phone: ${phone || ''}
Language: ${isHindi ? 'Hindi' : 'English'}`;

  try {
    const aiResult = await generateWithGemini(prompt, systemInstruction);
    const raw = aiResult.text.trim();
    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);

    return res.json({
      success: true,
      modelUsed: aiResult.model,
      data: {
        message: parsed.message || raw,
        highlights: parsed.highlights || ['Best Price', 'High Quality', 'Fast Shipping'],
        callToAction: parsed.callToAction || 'Reply to this message to order directly!',
      },
    });
  } catch (err: any) {
    console.error('WhatsApp AI generation error:', err);

    const fallbackMsg = isHindi
      ? `🌟 *${effectiveShop} से विशेष ऑफर!* 🌟\n\nनमस्ते जी! 🙏\nआपके लिए लाए हैं नया और आकर्षक *${productName}*।\n\n💥 *ऑफर मूल्य:* मात्र *₹${price}* ${discount ? `(${discount})` : ''}\n⏳ *ऑफर वैधता:* ${expiryDate || 'इस रविवार तक'}\n\n✅ प्रीमियम क्वालिटी फैब्रिक\n✅ सभी प्रमुख साइज़ उपलब्ध\n✅ आसान होम डिलीवरी\n\n📍 अपनी पसंद का साइज़ बुक करने के लिए *अभी इस मैसेज का उत्तर दें*!\nधन्यवाद, ${effectiveShop}`
      : `🌟 *EXCLUSIVE OFFER from ${effectiveShop}!* 🌟\n\nNamaste! 🙏\nWe are delighted to introduce our latest collection item: *${productName}*.\n\n🏷️ *Special Price:* Just *₹${price}* ${discount ? `(${discount})` : ''}\n⏰ *Offer Valid Till:* ${expiryDate || 'This Sunday midnight'}\n\n✨ *Key Highlights:*\n• Superior fabric & comfortable all-day fit\n• Guaranteed colors & stitching\n• Multiple sizes available\n\n🛍️ *How to order:*\nReply directly to this WhatsApp message with your size or address!\n\nWarm regards,\n*${effectiveShop}*`;

    return res.json({
      success: true,
      isFallback: true,
      data: {
        message: fallbackMsg,
        highlights: isHindi ? ['प्रीमियम क्वालिटी', 'आसान ऑर्डरिंग', 'सीमित समय ऑफर'] : ['Premium Fabric', 'Direct WhatsApp Ordering', 'Limited Period Deal'],
        callToAction: isHindi ? 'ऑर्डर के लिए इस मैसेज का रिप्लाई करें' : 'Reply directly to book your piece!',
      },
    });
  }
});

// --- HEALTH ROUTE ---
app.get('/api/health', (req: Request, res: Response) => {
  return res.json({ status: 'ok', service: 'VyaparAI Backend', time: new Date().toISOString() });
});

// --- VITE MIDDLEWARE OR STATIC SERVING ---
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`🚀 VyaparAI server listening on port ${PORT} (dev: ${isDev})`);
  });
}

startServer();
