import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { getCategories, getProducts, getProductsByCategory } from '../api/api';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

export default function HomeScreen({ navigation }) {
  const { cartCount } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadCategories();
    loadProducts(null, true);
  }, []);

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories([{ id: null, name: 'All' }, ...data]);
    } catch (err) {
      console.warn('No se pudieron cargar las categorías', err);
    }
  }

  async function loadProducts(categoryId = null, reset = true) {
    const offset = reset ? 0 : page * 10;

    if (reset) {
      setProducts([]);
      setPage(1);
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
        setHasMore(data.length === 10);
      }
    } catch (err) {
      setError('No se pudieron cargar los productos. Intenta de nuevo.');
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }

  function handleCategorySelect(categoryId) {
    setSelectedCategory(categoryId);
    loadProducts(categoryId, true);
  }

  function handleLoadMore() {
    if (loadingMore || !hasMore) {
      return;
    }

    loadProducts(selectedCategory, false);
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => loadProducts(selectedCategory, true)}>
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Catálogo</Text>
          <Text style={styles.subtitle}>Explora productos y encuentra lo que buscas</Text>
        </View>
        <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.cartButtonText}>🛒</Text>
          {cartCount > 0 ? <Text style={styles.cartBadge}>{cartCount}</Text> : null}
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(item) => item.id?.toString() || 'all'}
        contentContainerStyle={styles.categoryList}
        renderItem={({ item }) => {
          const isActive = selectedCategory === item.id;
          return (
            <TouchableOpacity
              style={[styles.categoryChip, isActive && styles.categoryChipActive]}
              onPress={() => handleCategorySelect(item.id)}
            >
              <Text style={[styles.categoryChipText, isActive && styles.categoryChipTextActive]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

    {products.length === 0 ? (
      <View style={styles.emptyContainer}>
        <Text style={styles.empty}>No hay productos disponibles en esta categoría.</Text>
      </View>
    ) : (
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadProducts(selectedCategory, true);
            }}
            tintColor="#2563eb"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
        ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#2563eb" style={styles.loader} /> : null}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('Detail', { product: item })}
            />
          </View>
        )}
      />
    )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#f9fafb',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 6,
  },
  cartButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartButtonText: {
    fontSize: 20,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#2563eb',
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    textAlign: 'center',
    lineHeight: 18,
    overflow: 'hidden',
  },
  categoryList: {
    paddingBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
    marginRight: 8,
    height: 35,
  },
  categoryChipActive: {
    backgroundColor: '#2563eb',
  },
  categoryChipText: {
    color: '#374151',
    fontWeight: '600',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  list: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productItem: {
    flex: 0.48,
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 24,
  },
  emptyContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  error: {
    color: '#b91c1c',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  retryButton: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
  loader: {
    marginTop: 8,
  },
});
