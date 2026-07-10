/**
 * CartContext.tsx
 *
 * Implementa un Context de React para administrar el carrito de compras.
 * Centraliza el estado del carrito y expone funciones para agregar,
 * eliminar y limpiar productos, permitiendo que cualquier componente
 * de la aplicación acceda a esta información sin necesidad de prop drilling.
 */

import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import { Product } from '../api/api';

/**
 * Representa un producto almacenado dentro del carrito.
 *
 * Incluye información adicional como la cantidad seleccionada,
 * independiente del modelo original recibido desde la API.
 */
type CartItem = {
  id: number;
  title: string;
  price: number;
  image?: string;
  quantity: number;
  category: string;
};

/**
 * Define el contrato del Context del carrito.
 *
 * Especifica el estado disponible y las operaciones que pueden
 * realizar los componentes consumidores.
 */
type CartContextValue = {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  cartCount: number;
};

/**
 * Context encargado de compartir la información del carrito
 * entre todos los componentes de la aplicación.
 */
const CartContext = createContext<CartContextValue | undefined>(undefined);

/**
 * Proveedor del Context del carrito.
 *
 * Envuelve la aplicación y pone a disposición el estado del carrito
 * junto con las funciones para manipularlo.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  /**
   * Agrega un producto al carrito.
   *
   * Si el producto ya existe, incrementa su cantidad.
   * En caso contrario, crea un nuevo elemento dentro del carrito.
   *
   * @param product Producto seleccionado por el usuario.
   */
  const addToCart = (product: Product) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...prevItems,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.images?.[0],
          quantity: 1,
          category: product.category?.name || 'General',
        },
      ];
    });
  };

  /**
   * Elimina un producto del carrito utilizando su identificador.
   *
   * @param productId Identificador del producto a eliminar.
   */
  const removeFromCart = (productId: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== productId));
  };

  /**
   * Vacía completamente el carrito de compras.
   */
  const clearCart = () => {
    setItems([]);
  };

  /**
   * Calcula la cantidad total de productos agregados al carrito.
   *
   * Se memoriza utilizando useMemo para evitar cálculos innecesarios
   * cuando el contenido del carrito no ha cambiado.
   */
  const cartCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  /**
   * Memoriza el objeto compartido por el Context para evitar
   * renderizados innecesarios en los componentes consumidores.
   */
  const value = useMemo(
    () => ({
      items,
      addToCart,
      removeFromCart,
      clearCart,
      cartCount,
    }),
    [items, cartCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/**
 * Hook personalizado para acceder al Context del carrito.
 *
 * Debe utilizarse únicamente dentro de un componente que esté
 * envuelto por el CartProvider.
 *
 * @returns Estado y operaciones disponibles del carrito.
 * @throws Error Si se utiliza fuera del CartProvider.
 */
export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}