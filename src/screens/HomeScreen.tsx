/**
 * HomeScreen.tsx
 *
 * Pantalla principal de la aplicación.
 *
 * Muestra el catálogo de productos obtenido desde la API, permite filtrar
 * por categorías, actualizar la información mediante pull-to-refresh,
 * cargar más productos utilizando paginación y navegar tanto al detalle
 * de un producto como al carrito de compras.
 */

import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';

/**
 * Pantalla principal del catálogo.
 */
export default function HomeScreen({ navigation }: { navigation: any }) {
  // Obtiene la cantidad total de productos agregados al carrito.
  const { cartCount } = useCart();

  // Consume el hook encargado de administrar el catálogo de productos.
  const {
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
  } = useProducts();

  /**
   * Actualiza la categoría seleccionada y vuelve a cargar
   * los productos correspondientes.
   *
   * @param categoryId Identificador de la categoría seleccionada.
   */
  function handleCategorySelect(categoryId: number | null) {
    setSelectedCategory(categoryId);
    loadProducts(categoryId, true);
  }

  /**
   * Solicita la siguiente página de productos cuando el usuario
   * llega al final de la lista.
   *
   * Evita realizar múltiples peticiones simultáneas y verifica
   * que aún existan elementos por cargar.
   */
  function handleLoadMore() {
    if (loadingMore || !hasMore) {
      return;
    }

    loadProducts(selectedCategory, false);
  }

  // Muestra un indicador de carga durante la obtención inicial de datos.
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  // Muestra un mensaje de error y permite reintentar la operación.
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => loadProducts(selectedCategory, true)}
        >
          <Text style={styles.retryText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Encabezado con título y acceso al carrito. */}
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Catálogo</Text>
          <Text style={styles.subtitle}>
            Explora productos y encuentra lo que buscas
          </Text>
        </View>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.cartButtonText}>🛒</Text>

          {/* Muestra la cantidad de productos únicamente cuando es mayor a cero. */}
          {cartCount > 0 ? (
            <Text style={styles.cartBadge}>{cartCount}</Text>
          ) : null}
        </TouchableOpacity>
      </View>

      {/* Lista horizontal utilizada para seleccionar una categoría. */}
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
              style={[
                styles.categoryChip,
                isActive && styles.categoryChipActive,
              ]}
              onPress={() => handleCategorySelect(item.id)}
            >
              <Text
                style={[
                  styles.categoryChipText,
                  isActive && styles.categoryChipTextActive,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {/* Si la categoría no contiene productos, se muestra un mensaje informativo. */}
      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.empty}>
            No hay productos disponibles en esta categoría.
          </Text>
        </View>
      ) : (
        <FlatList
          data={products}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.row}

          // Permite actualizar el catálogo deslizando hacia abajo.
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

          // Implementa la paginación del catálogo.
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.2}

          // Muestra un indicador mientras se cargan más productos.
          ListFooterComponent={
            loadingMore ? (
              <ActivityIndicator
                size="small"
                color="#2563eb"
                style={styles.loader}
              />
            ) : null
          }

          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <ProductCard
                product={item}
                onPress={() =>
                  navigation.navigate('Detail', { product: item })
                }
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