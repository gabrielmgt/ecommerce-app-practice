import { createContext, useState, useContext } from 'react';
import { getDummyCart } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
	const [view, setView] = useState('home'); //home, checkout, shipping
	const [shippingCost, setShippingCost] = useState(null);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);
		
	const generateCart = async () => {
		setLoading(true);
		setError('');
		try {
			const dummyCart = await getDummyCart();
			//transformar a formato backend
			const transformedProducts = dummyCart.products.map(p => {
				return {
				productId: p.id.toString(),
				price: p.price,
				quantity: p.quantity,
				discount: p.discountPercentage,
				title: p.title,
				thumbnail: p.thumbnail,
				discountedTotal: p.discountedTotal,
				}
			});
			const newCart = { ...dummyCart, products: transformedProducts };
			setCart(newCart);
			console.log("Carrito generado:", newCart);
			setShippingCost(null);
		} catch (err) {
			setError('Error generando carrito.')
		} finally {
			setLoading(false);
		}
	};
	
	const clearCart = () => {
		setCart(null);
		setShippingCost(null);
		setError('');
		setView('home');
	};
	
	const updateCartState = (newProducts) => {
		if (newProducts.length === 0){
			setCart(null);
		} else {
			const newTotal = newProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
			const newDiscountedTotal = newProducts.reduce((sum, p) => sum + p.discountedTotal, 0);
			setCart(prevCart => ({
				...prevCart,
				products: newProducts,
				total: newTotal,
				discountedTotal: newDiscountedTotal,
			}));
		}
	};
	
	const removeItem = (productId) => {
		const newProducts = cart.products.filter(p => p.productId !== productId);
		updateCartState(newProducts);
	};
	
	const updateQuantity = (productId, newQuantity) => {
		if (newQuantity < 1) return;
		
		const newProducts = cart.products.map(p => { //TODO: use hash map 
			if (p.productId === productId){
				const originalPrice = p.price;
				const discountPercentage = p.discount;
				const discountedPricePerUnit = originalPrice * (1 - discountPercentage/100);
				
				return {
					...p,
					quantity: newQuantity,
					discountedTotal: discountedPricePerUnit * newQuantity
				};
			}
			return p;
		});
		updateCartState(newProducts);
	};
	
	const value = {
		cart,
		view,
		shippingCost,
		error,
		loading,
		generateCart,
		clearCart,
		removeItem,
		updateQuantity,
		setView,
		setShippingCost,
		setError,
		setCart
	};
	
	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
	return useContext(AppContext);
};
