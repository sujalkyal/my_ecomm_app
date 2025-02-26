"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import CartItem from "../../../components/CartItem";

const CartPage = () => {
  const [cart, setCart] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [updateTrigger, setUpdateTrigger] = useState(false); // ✅ Track cart updates
  const shippingCost = 0; // Free shipping

  const fetchCart = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/user/getCartDetails");
      setCart(response.data.result);  // ✅ Extracting cart items correctly
      setSubtotal(response.data.totalAmount);  // ✅ Updating subtotal correctly
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [updateTrigger]); // ✅ Re-fetch when cart updates

  const handleCartUpdate = () => {
    setUpdateTrigger((prev) => !prev); // ✅ Toggle state to trigger useEffect
  };

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`/api/user/deleteitemcart/${productId}`);
      handleCartUpdate(); // ✅ Trigger re-fetch after item removal
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      <div className="grid gap-4">
        {cart.length > 0 ? (
          cart.map(({ product, quantity }) => (
            <CartItem 
              key={product.id} 
              product={product} 
              quantity={quantity} 
              onRemove={handleRemove} 
              onQuantityChange={handleCartUpdate} // ✅ Pass function to update subtotal
            />
          ))
        ) : (
          <p className="text-gray-500">Your cart is empty.</p>
        )}
      </div>

      {/* Cart Summary */}
      <div className="mt-8 p-6 border rounded-lg shadow-md w-96">
        <h3 className="text-lg font-semibold mb-4">Cart Total</h3>
        <p className="flex justify-between"><span>Subtotal:</span> <span>${subtotal.toFixed(2)}</span></p>
        <p className="flex justify-between"><span>Shipping:</span> <span>{shippingCost === 0 ? "Free" : `$${shippingCost}`}</span></p>
        <hr className="my-3" />
        <p className="flex justify-between font-bold text-lg"><span>Total:</span> <span>${(subtotal + shippingCost).toFixed(2)}</span></p>
        <button className="w-full mt-4 bg-red-500 text-white py-2 rounded-md">Proceed to Checkout</button>
      </div>
    </div>
  );
};

export default CartPage;
