import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { postCart } from '../services/api';

const ShippingForm = () => {
  const { cart, setView, setShippingCost, setError, shippingCost, error } = useAppContext();
  const [customerData, setCustomerData] = useState({
    name: '',
    shipping_street: '',
    commune: '',
    phone: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        products: cart.products,
        customer_data: customerData,
      };
      setError('');
      const response = await postCart(payload);
      setShippingCost(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'No hay envíos disponibles :(')
      setShippingCost(null);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h3>Datos de Envío</h3>
        <input name="name" value={customerData.name} onChange={handleChange} placeholder="Nombre" required />
        <input name="shipping_street" value={customerData.shipping_street} onChange={handleChange} placeholder="Dirección" required />
        <input name="commune" value={customerData.commune} onChange={handleChange} placeholder="Comuna" required />
        <input name="phone" value={customerData.phone} onChange={handleChange} placeholder="Teléfono" required />
        <button type="submit">Cotizar Despacho</button>
        <button type="button" onClick={() => {setView('checkout'); setError('');}}>Volver al Carrito</button>
      </form>
    <div>
      {shippingCost && (
        <p className="shipping-success">
          Envío Flapp con {shippingCost.courier} ⚡ - ${shippingCost.price.toFixed(2)}
        </p>
      )}
       {error && <p className="shipping-error">{error}</p>}
    </div>
    </div>
  
  );

};

export default ShippingForm;