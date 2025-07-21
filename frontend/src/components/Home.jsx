import { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

const Home = () => {
  const { cart, generateCart, setView, loading, error } = useAppContext();
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (!loading && cart && !error){
      setStatusMessage("Carrito generado :)");
    }
  }, [loading, cart, error]);

  const handleGenerateCart = () => {
    setStatusMessage("");
    generateCart();
  };

  return (
    <div>
      <h2>Bienvenido a Flapp</h2>
      <button onClick={handleGenerateCart} disabled={loading}>
        {loading ? 'Generando carrito...' : 'Generar carrito'}
      </button>
      {statusMessage && <p>{statusMessage}</p>}
      {cart && !loading && <button onClick={() => setView('checkout')}>Finalizar compra</button>}
    </div>
  );
};

export default Home;