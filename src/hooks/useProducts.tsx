/**
 * useProducts.tsx
 *
 * Custom Hook encargado de administrar la lógica relacionada con el catálogo
 * de productos. Centraliza la obtención de datos desde la API, el manejo de
 * categorías, la paginación, los estados de carga, la actualización de la
 * lista y el manejo de errores.
 *
 * Al separar esta lógica de las pantallas, se obtiene un código más limpio,
 * reutilizable y fácil de mantener.
 */

import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { Category, getCategories, getProducts, getProductsByCategory, Product } from '../api/api';

/**
 * Define la información y funciones expuestas por el hook.
 */
export type UseProductsResult = {
  products: Product[];
  categories: Category[];
  loading: boolean;
  loadingMore: boolean;
  refreshing: boolean;
  error: string | null;
  selectedCategory: number | null;
  setSelectedCategory: Dispatch<SetStateAction<number | null>>;
  setRefreshing: Dispatch<SetStateAction<boolean>>;
  hasMore: boolean;
  loadProducts: (categoryId?: number | null, reset?: boolean) => Promise<void>;
};

/**
 * Hook encargado de administrar el catálogo de productos.
 *
 * @returns Estado del catálogo y funciones para interactuar con él.
 */
export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Estado utilizado para reflejar la página actual en la interfaz.
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  /**
   * Referencia mutable utilizada para controlar la paginación sin provocar
   * renderizados adicionales. Se emplea para calcular el offset de las
   * siguientes peticiones a la API.
   */
  const pageRef = useRef(1);

  /**
   * Obtiene las categorías disponibles desde la API.
   *
   * Se agrega manualmente una categoría "All" para permitir al usuario
   * visualizar todos los productos sin aplicar filtros.
   */
  const loadCategories = useCallback(async (): Promise<void> => {
    try {
      const data = await getCategories();

      setCategories([
        { id: null, name: 'All' },
        ...data,
      ]);
    } catch (err) {
      console.warn('No se pudieron cargar las categorías', err);
    }
  }, []);

  /**
   * Obtiene productos desde la API.
   *
   * Dependiendo de los parámetros recibidos, esta función puede:
   * - Cargar el catálogo inicial.
   * - Filtrar productos por categoría.
   * - Actualizar la lista (pull to refresh).
   * - Cargar más elementos mediante paginación.
   *
   * @param categoryId Categoría seleccionada. Si es null, obtiene todos los productos.
   * @param reset Indica si la lista debe reiniciarse o si deben agregarse más productos.
   */
  const loadProducts = useCallback(async (
    categoryId: number | null = null,
    reset = true
  ): Promise<void> => {

    // Calcula el punto desde donde la API comenzará a devolver resultados.
    const offset = reset ? 0 : pageRef.current * 10;

    if (reset) {
      // Reinicia completamente el estado del catálogo.
      setProducts([]);
      setPage(1);
      pageRef.current = 1;
      setHasMore(true);
    } else {
      // Activa únicamente el indicador de carga para paginación.
      setLoadingMore(true);
    }

    try {
      setError(null);

      const data = categoryId
        ? await getProductsByCategory(categoryId, offset, 10)
        : await getProducts(offset, 10);

      if (reset) {
        // Reemplaza la lista completa de productos.
        setProducts(data);
        setHasMore(data.length === 10);
      } else {
        // Agrega los nuevos productos al final de la lista existente.
        setProducts((prev) => [...prev, ...data]);

        setPage((prev) => prev + 1);
        pageRef.current += 1;
        setHasMore(data.length === 10);
      }

      // Si la API devuelve menos elementos que el límite solicitado,
      // significa que ya no existen más productos por cargar.
      setHasMore(data.length === 10);

    } catch {
      setError('No se pudieron cargar los productos. Intenta de nuevo.');
    } finally {
      // Restablece todos los indicadores de carga.
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, []);

  /**
   * Carga inicial del hook.
   *
   * Se ejecuta únicamente al montar el componente que consume este hook,
   * descargando las categorías y la primera página de productos.
   */
  useEffect(() => {
    loadCategories();
    loadProducts(null, true);
  }, [loadCategories, loadProducts]);

  return {
    products,
    categories,
    loading,
    loadingMore,
    refreshing,
    error,
    selectedCategory,
    setSelectedCategory,
    setRefreshing,
    hasMore,
    loadProducts,
  };
}