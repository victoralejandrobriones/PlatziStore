/**
 * api.tsx
 *
 * Centraliza todas las llamadas HTTP de la aplicación.
 * Mantener el acceso a la API en un único archivo facilita
 * el mantenimiento y evita duplicar lógica de red en las pantallas.
 */

/**
 * URL base de la API de Platzi Fake Store.
 * Todas las peticiones HTTP del proyecto parten de este endpoint.
 */
const BASE_URL = 'https://api.escuelajs.co/api/v1';

/**
 * Representa una categoría de productos.
 */
export type Category = {
  id: number | null;
  name: string;
};

/**
 * Modelo de un producto obtenido desde la API.
 *
 * Algunos campos son opcionales porque la API puede no incluirlos
 * en todas las respuestas.
 */
export type Product = {
  id: number;
  title: string;
  price: number;
  description?: string;
  images?: string[];
  category?: Category | null;

  /**
   * Permite aceptar propiedades adicionales devueltas por la API
   * sin que TypeScript genere errores de tipado.
   */
  [key: string]: unknown;
};

/**
 * Obtiene una lista paginada de productos.
 *
 * @param offset Índice desde donde comenzar la consulta.
 * @param limit Cantidad máxima de productos a obtener.
 * @returns Lista de productos.
 * @throws Error Si la petición HTTP falla.
 */
export async function getProducts(
  offset = 0,
  limit = 10
): Promise<Product[]> {
  const response = await fetch(
    `${BASE_URL}/products?offset=${offset}&limit=${limit}`
  );

  // Verifica que la petición haya sido exitosa.
  if (!response.ok) {
    throw new Error('No se pudieron cargar los productos');
  }

  return response.json() as Promise<Product[]>;
}

/**
 * Obtiene todas las categorías disponibles.
 *
 * @returns Lista de categorías.
 * @throws Error Si la petición HTTP falla.
 */
export async function getCategories(): Promise<Category[]> {
  const response = await fetch(`${BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error('No se pudieron cargar las categorías');
  }

  return response.json() as Promise<Category[]>;
}

/**
 * Obtiene una lista paginada de productos pertenecientes
 * a una categoría específica.
 *
 * @param categoryId Identificador de la categoría.
 * @param offset Índice desde donde comenzar la consulta.
 * @param limit Cantidad máxima de productos a obtener.
 * @returns Lista de productos filtrados por categoría.
 * @throws Error Si la petición HTTP falla.
 */
export async function getProductsByCategory(
  categoryId: number,
  offset = 0,
  limit = 10
): Promise<Product[]> {
  const response = await fetch(
    `${BASE_URL}/categories/${categoryId}/products?offset=${offset}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error('No se pudieron cargar los productos de la categoría');
  }

  return response.json() as Promise<Product[]>;
}