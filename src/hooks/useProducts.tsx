import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { Category, getCategories, getProducts, getProductsByCategory, Product } from '../api/api';

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

export function useProducts(): UseProductsResult {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);

  const loadCategories = useCallback(async (): Promise<void> => {
    try {
      const data = await getCategories();
      setCategories([{ id: null, name: 'All' }, ...data]);
    } catch (err) {
      console.warn('No se pudieron cargar las categorías', err);
    }
  }, []);

  const loadProducts = useCallback(async (categoryId: number | null = null, reset = true): Promise<void> => {
    const offset = reset ? 0 : pageRef.current * 10;

    if (reset) {
      setProducts([]);
      setPage(1);
      pageRef.current = 1;
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    try {
      setError(null);
      const data = categoryId
        ? await getProductsByCategory(categoryId, offset, 10)
        : await getProducts(offset, 10);

      if (reset) {
        setProducts(data);
        setHasMore(data.length === 10);
      } else {
        setProducts((prev) => [...prev, ...data]);
        setPage((prev) => prev + 1);
        pageRef.current += 1;
        setHasMore(data.length === 10);
      }
    } catch {
      setError('No se pudieron cargar los productos. Intenta de nuevo.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }, []);

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
