import React from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';

export default function CartScreen({ navigation }) {
  const { items, removeFromCart, clearCart } = useCart();

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handlePay() {
    clearCart();
    Alert.alert('Pago simulado', 'Tu compra fue procesada correctamente.');
    navigation.goBack();
  }

  if (!items.length) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
        <Text style={styles.emptyText}>Agrega productos desde el catálogo.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView edges={['bottom']} style={styles.safeArea}>
        <View style={styles.container}>
        <FlatList
            data={items}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
            <View style={styles.itemCard}>
                <View style={styles.itemInfo}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemMeta}>Cantidad: {item.quantity}</Text>
                <Text style={styles.itemPrice}>${item.price * item.quantity}</Text>
                </View>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                <Text style={styles.removeText}>Quitar</Text>
                </TouchableOpacity>
            </View>
            )}
        />

        <View style={styles.footer}>
            <Text style={styles.total}>Total: ${total.toFixed(2)}</Text>
            <TouchableOpacity style={styles.payButton} onPress={handlePay}>
            <Text style={styles.payText}>Pagar</Text>
            </TouchableOpacity>
        </View>
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  list: {
    padding: 16,
    paddingBottom: 24,
  },
  itemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  itemMeta: {
    color: '#6b7280',
    marginTop: 4,
  },
  itemPrice: {
    color: '#2563eb',
    fontWeight: '700',
    marginTop: 6,
  },
  removeText: {
    color: '#dc2626',
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
    backgroundColor: '#fff',
  },
  total: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  payButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  payText: {
    color: '#fff',
    fontWeight: '700',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    color: '#6b7280',
    textAlign: 'center',
  },
});
