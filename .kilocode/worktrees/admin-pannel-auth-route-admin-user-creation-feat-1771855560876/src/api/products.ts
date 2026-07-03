export interface Product {
  _id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice?: number;
  image: string;
  images: string[];
  description: string;
  specs: Record<string, string>;
  specifications?: Record<string, string>;
  compatibility: string[];
  inStock: boolean;
  stock: number;
  rating: number;
  reviews: number;
  reviewCount?: number;
  oemCode: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

export const getProducts = async (filters?: {
  category?: string;
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ products: Product[]; total: number }> => {
  const params = new URLSearchParams();
  if (filters?.category) params.append("category", filters.category);
  if (filters?.brand) params.append("brand", filters.brand);
  if (filters?.priceMin) params.append("priceMin", filters.priceMin.toString());
  if (filters?.priceMax) params.append("priceMax", filters.priceMax.toString());
  if (filters?.search) params.append("search", filters.search);
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());

  // Add cache-busting timestamp
  params.append("_t", Date.now().toString());

  const url = `${API_BASE_URL}/api/products?${params.toString()}`;
  console.log('🌐 [DEBUG] getProducts: Making API request', {
    url,
    baseUrl: API_BASE_URL,
    filters
  });

  try {
    const response = await fetch(url, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    console.log('🌐 [DEBUG] getProducts: Response received', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      console.error('🚫 [DEBUG] getProducts: Request failed', {
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ [DEBUG] getProducts: Request successful', {
      productsCount: data.products?.length || 0,
      total: data.total
    });

    return data;
  } catch (error) {
    console.error('🚫 [DEBUG] getProducts: Network error', {
      error: error,
      message: (error as any)?.message,
      url
    });
    throw error;
  }
};

export const getProductById = async (id: string): Promise<Product> => {
  const url = `${API_BASE_URL}/api/products/${encodeURIComponent(id)}`;
  console.log('🌐 [DEBUG] getProductById: Making API request', {
    productId: id,
    url,
    baseUrl: API_BASE_URL
  });

  try {
    const response = await fetch(url);
    console.log('🌐 [DEBUG] getProductById: Response received', {
      productId: id,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok
    });

    if (!response.ok) {
      console.error('🚫 [DEBUG] getProductById: Request failed', {
        productId: id,
        status: response.status,
        statusText: response.statusText
      });
      throw new Error(`Failed to fetch product by ID: ${response.status} ${response.statusText}`);
    }

    const product = await response.json();
    console.log('✅ [DEBUG] getProductById: Request successful', {
      productId: product._id,
      productName: product.name,
      price: product.price,
      hasImages: !!product.images?.length
    });

    return product;
  } catch (error) {
    console.error('🚫 [DEBUG] getProductById: Network error', {
      productId: id,
      error: error,
      message: (error as any)?.message,
      url
    });
    throw error;
  }
};

export const getRelatedProducts = async (productId: string): Promise<Product[]> => {
  const response = await fetch(`${API_BASE_URL}/api/products/${encodeURIComponent(productId)}/similar`);
  if (!response.ok) {
    throw new Error("Failed to fetch related products");
  }
  return response.json();
};
