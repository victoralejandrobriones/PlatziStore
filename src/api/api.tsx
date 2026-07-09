const BASE_URL = 'https://api.escuelajs.co/api/v1';

export type Category = {
  id: number | null;
  name: string;
};

export type ProductCategory = {
  id: number;
  name: string;
};

export type Product = {
  id: number;
  title: string;
  price: number;
  description?: string;
  images?: string[];
  category?: ProductCategory | null;
  [key: string]: unknown;
};

export async function getProducts(offset = 0, limit = 10): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/products?offset=${offset}&limit=${limit}`);

  if (!response.ok) {
    throw new Error('No se pudieron cargar los productos');
  }

  return response.json() as Promise<Product[]>;
}

export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error('No se pudieron cargar las categorías');
  }

  return response.json() as Promise<Category[]>;
}

export async function getProductsByCategory(categoryId: number, offset = 0, limit = 10): Promise<Product[]> {
  const response = await fetch(`${BASE_URL}/categories/${categoryId}/products?offset=${offset}&limit=${limit}`);

  if (!response.ok) {
    throw new Error('No se pudieron cargar los productos de la categoría');
  }

  return response.json() as Promise<Product[]>;
}
