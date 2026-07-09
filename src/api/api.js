const BASE_URL = 'https://api.escuelajs.co/api/v1';

export async function getProducts(offset = 0, limit = 10) {
  const response = await fetch(`${BASE_URL}/products?offset=${offset}&limit=${limit}`);

  if (!response.ok) {
    throw new Error('No se pudieron cargar los productos');
  }

  return response.json();
}

export async function getCategories() {
  const response = await fetch(`${BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error('No se pudieron cargar las categorías');
  }

  return response.json();
}

export async function getProductsByCategory(categoryId, offset = 0, limit = 10) {
  const response = await fetch(`${BASE_URL}/categories/${categoryId}/products?offset=${offset}&limit=${limit}`);

  if (!response.ok) {
    throw new Error('No se pudieron cargar los productos de la categoría');
  }

  return response.json();
}
