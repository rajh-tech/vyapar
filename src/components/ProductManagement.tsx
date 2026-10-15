import React, { useState } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  X,
  ExternalLink,
  ChevronDown,
  Sparkles,
  IndianRupee,
  PlusCircle,
  MinusCircle,
  Tag,
  Image as ImageIcon,
} from 'lucide-react';
import { Product, ClothingCategory, Language, BusinessSettings } from '../types';
import { getTranslation } from '../utils/translations';

interface ProductManagementProps {
  products: Product[];
  onAddProduct: (product: Partial<Product>) => Promise<void>;
  onUpdateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  settings: BusinessSettings | null;
  language: Language;
  isAddModalOpenInitially?: boolean;
  onCloseInitialModal?: () => void;
}

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  settings,
  language,
  isAddModalOpenInitially,
  onCloseInitialModal,
}) => {
  const t = getTranslation(language);
  const threshold = settings?.lowStockThreshold ?? 5;

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStockStatus, setSelectedStockStatus] = useState('All');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(Boolean(isAddModalOpenInitially));
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ClothingCategory>('Sarees & Ethnic');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState<number | ''>(1499);
  const [originalPrice, setOriginalPrice] = useState<number | ''>(2199);
  const [quantity, setQuantity] = useState<number | ''>(10);
  const [sizes, setSizes] = useState<string[]>(['M', 'L', 'XL']);
  const [colour, setColour] = useState('Peacock Blue');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const categories: ClothingCategory[] = [
    'Sarees & Ethnic',
    'Kurtis & Suits',
    "Men's Shirts & Kurta",
    "T-Shirts & Jeans",
    'Dresses & Western',
    "Kids' Wear",
    'Fabrics & Unstitched',
    'Winterwear',
    'Accessories & Dupattas',
  ];

  const presetPhotos = [
    { label: 'Saree', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80' },
    { label: 'Kurti Suit', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80' },
    { label: 'Linen Shirt', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=600&q=80' },
    { label: 'Printed Kurti', url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80' },
    { label: 'Silk Kurta', url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80' },
    { label: 'Western Dress', url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80' },
  ];

  const availableSizes = ['Free Size', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '38', '40', '42', '44'];

  const openAddModal = () => {
    setEditingProduct(null);
    setName('');
    setCategory('Sarees & Ethnic');
    setSku('SKU-' + Math.floor(1000 + Math.random() * 9000));
    setPrice(999);
    setOriginalPrice(1499);
    setQuantity(10);
    setSizes(['Free Size']);
    setColour('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80');
    setFormError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setCategory(prod.category as ClothingCategory);
    setSku(prod.sku);
    setPrice(prod.price);
    setOriginalPrice(prod.originalPrice || '');
    setQuantity(prod.quantity);
    setSizes(prod.sizes || []);
    setColour(prod.colour);
    setDescription(prod.description);
    setImageUrl(prod.imageUrl || '');
    setFormError(null);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    if (onCloseInitialModal) onCloseInitialModal();
  };

  const handleSizeToggle = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || price === '' || quantity === '') {
      setFormError('Please fill product name, price, and quantity.');
      return;
    }

    setSubmitting(true);
    setFormError(null);

    try {
      const payload = {
        name: name.trim(),
        category,
        sku: sku.trim() || 'SKU-' + Math.floor(1000 + Math.random() * 9000),
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        quantity: Number(quantity),
        sizes: sizes.length > 0 ? sizes : ['Free Size'],
        colour: colour.trim() || 'Standard',
        description: description.trim(),
        imageUrl: imageUrl.trim(),
      };

      if (editingProduct) {
        await onUpdateProduct(editingProduct.id, payload);
      } else {
        await onAddProduct(payload);
      }
      handleModalClose();
    } catch (err: any) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStockQuickChange = async (prod: Product, delta: number) => {
    const newQty = Math.max(0, prod.quantity + delta);
    await onUpdateProduct(prod.id, { quantity: newQty });
  };

  const confirmDelete = async () => {
    if (!deletingProductId) return;
    try {
      await onDeleteProduct(deletingProductId);
      setDeletingProductId(null);
    } catch (err) {
      console.error('Delete error', err);
    }
  };

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;

    let matchesStock = true;
    if (selectedStockStatus === 'in_stock') matchesStock = p.quantity > threshold;
    if (selectedStockStatus === 'low_stock') matchesStock = p.quantity > 0 && p.quantity <= threshold;
    if (selectedStockStatus === 'out_of_stock') matchesStock = p.quantity === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="space-y-5 sm:space-y-6 animate-in fade-in duration-200">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 bg-slate-900/90 border border-slate-800 p-5 sm:p-6 rounded-2xl shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Package className="w-5 h-5 text-indigo-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-white">{t.menuProducts}</h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            {products.length} {language === 'hi' ? 'कपड़े / उत्पाद कैटलॉग में हैं' : 'total items in your boutique inventory'}
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addProduct}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 p-3 sm:p-4 rounded-2xl space-y-3">
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Category & Stock Filter Controls */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">{t.allCategories}</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedStockStatus}
              onChange={(e) => setSelectedStockStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">{t.allStock}</option>
              <option value="in_stock">{t.statusInStock}</option>
              <option value="low_stock">{t.statusLowStock} (≤ {threshold})</option>
              <option value="out_of_stock">{t.statusOutOfStock}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Display (Table on Desktop, Touch-Friendly Cards on Mobile) */}
      {filteredProducts.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center border-dashed space-y-3">
          <Package className="w-10 h-10 text-slate-500 mx-auto" />
          <h3 className="font-bold text-white text-base">No matching products found</h3>
          <p className="text-xs text-slate-400">
            Try adjusting your search keywords or stock filters.
          </p>
        </div>
      ) : (
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Product</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Price (₹)</th>
                  <th className="py-3.5 px-4 font-semibold">Stock / Qty</th>
                  <th className="py-3.5 px-4 font-semibold">Sizes</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filteredProducts.map((p) => {
                  const isLow = p.quantity > 0 && p.quantity <= threshold;
                  const isOut = p.quantity === 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {p.imageUrl ? (
                            <img
                              src={p.imageUrl}
                              alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover bg-slate-800 border border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center font-bold text-sm shrink-0">
                              {p.name.charAt(0)}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-white text-sm">{p.name}</div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              SKU: {p.sku} {p.colour ? `• ${p.colour}` : ''}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-xs">
                          {p.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white font-mono">₹{p.price}</div>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <div className="text-[11px] text-slate-500 line-through font-mono">
                            ₹{p.originalPrice}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStockQuickChange(p, -1)}
                            disabled={p.quantity === 0}
                            className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40 active:scale-90"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>
                          <span className="font-bold text-white font-mono min-w-[28px] text-center">
                            {p.quantity}
                          </span>
                          <button
                            onClick={() => handleStockQuickChange(p, 1)}
                            className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 active:scale-90"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>

                          <span
                            className={`ml-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isOut
                                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                                : isLow
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {isOut ? t.statusOutOfStock : isLow ? t.statusLowStock : t.statusInStock}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1 max-w-[120px]">
                          {p.sizes.map((s, i) => (
                            <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(p)}
                            title="Edit Product"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-400 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingProductId(p.id)}
                            title="Delete Product"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600/30 text-slate-300 hover:text-rose-400 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile High-Impact Product Cards */}
          <div className="lg:hidden divide-y divide-slate-800/80">
            {filteredProducts.map((p) => {
              const isLow = p.quantity > 0 && p.quantity <= threshold;
              const isOut = p.quantity === 0;

              return (
                <div key={p.id} className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    {p.imageUrl ? (
                      <img
                        src={p.imageUrl}
                        alt={p.name}
                        className="w-16 h-20 rounded-xl object-cover bg-slate-800 border border-slate-700 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-20 rounded-xl bg-indigo-950 border border-indigo-800 text-indigo-400 flex items-center justify-center font-bold text-lg shrink-0">
                        {p.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {p.sku}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isOut
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : isLow
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {isOut ? 'Out of Stock' : isLow ? 'Low Stock' : 'In Stock'}
                        </span>
                      </div>

                      <h4 className="font-bold text-white text-sm mt-1 line-clamp-1">{p.name}</h4>
                      <p className="text-[11px] text-slate-400 truncate">{p.category} {p.colour ? `• ${p.colour}` : ''}</p>

                      <div className="flex items-baseline gap-2 mt-1.5">
                        <span className="font-extrabold text-white text-base font-mono">₹{p.price}</span>
                        {p.originalPrice && p.originalPrice > p.price && (
                          <span className="text-xs text-slate-500 line-through font-mono">₹{p.originalPrice}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stock Stepper & Quick Actions */}
                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80">
                    <div className="flex items-center gap-1.5 bg-slate-950 px-2 py-1 rounded-xl border border-slate-800">
                      <button
                        onClick={() => handleStockQuickChange(p, -1)}
                        disabled={p.quantity === 0}
                        className="p-1 rounded-md text-slate-400 hover:text-white disabled:opacity-30 active:scale-90"
                      >
                        <MinusCircle className="w-4 h-4" />
                      </button>
                      <span className="font-bold text-white text-xs font-mono px-1">
                        {p.quantity} pcs
                      </span>
                      <button
                        onClick={() => handleStockQuickChange(p, 1)}
                        className="p-1 rounded-md text-slate-400 hover:text-white active:scale-90"
                      >
                        <PlusCircle className="w-4 h-4 text-emerald-400" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white active:scale-95 transition-transform"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingProductId(p.id)}
                        className="p-2 rounded-xl bg-slate-800 text-rose-400 hover:bg-rose-500/20 active:scale-95 transition-transform"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Add Product Button for Mobile */}
      <button
        onClick={openAddModal}
        title="Add Product"
        className="lg:hidden fixed right-4 bottom-20 z-40 w-12 h-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-xl shadow-indigo-600/50 active:scale-90 transition-transform cursor-pointer"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* ADD / EDIT PRODUCT MODAL (Mobile Responsive) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden my-4 sm:my-8">
            <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-bold text-white">
                {editingProduct ? t.editProduct : t.addProduct}
              </h2>
              <button
                onClick={handleModalClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 sm:p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.productName} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Pure Banarasi Silk Zari Saree"
                  className="w-full px-3 py-2.5 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.category} *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ClothingCategory)}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.sku}
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. BNS-01"
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.price} *
                  </label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Qty *
                  </label>
                  <input
                    type="number"
                    required
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {t.sizes}
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {availableSizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleSizeToggle(s)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        sizes.includes(s)
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Product Image URL or Select Preset:
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-2"
                />
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {presetPhotos.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`text-[10px] px-2 py-1 rounded-md border whitespace-nowrap transition-colors ${
                        imageUrl === preset.url
                          ? 'bg-indigo-600 text-white border-indigo-500'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.colour}
                  </label>
                  <input
                    type="text"
                    value={colour}
                    onChange={(e) => setColour(e.target.value)}
                    placeholder="e.g. Royal Peacock Blue"
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    {t.description}
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Soft fabric, zari embroidery..."
                    className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold shadow-md shadow-indigo-600/30 cursor-pointer active:scale-95"
                >
                  {submitting ? t.loading : t.saveProduct}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-white">Delete Product</h3>
              <p className="text-xs text-slate-400 mt-1">{t.deleteConfirm}</p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setDeletingProductId(null)}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-600/30 cursor-pointer"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
