/**
 * App.tsx
 *
 * Punto de entrada de la aplicación.
 *
 * Inicializa los proveedores globales y monta la estructura principal
 * de navegación. El CartProvider envuelve toda la aplicación para que
 * cualquier pantalla pueda acceder al estado compartido del carrito.
 */

import AppNavigator from './navigation/AppNavigator';
import { CartProvider } from './context/CartContext';

/**
 * Componente raíz de la aplicación.
 */
export default function App() {
  return (
    <CartProvider>
      <AppNavigator />
    </CartProvider>
  );
}