import { useAppContext } from '../context/AppContext';

const Checkout = () => {
  const { cart, clearCart, setView, removeItem, updateQuantity, setShippingCost } = useAppContext();

  if (!cart) {
    return (
      <div>
        <p>Tu carrito está vacío.</p>
        <button onClick={() => setView('home')}>Volver al inicio</button>
      </div>
    );
  }

  return (
    <div className="checkout-container"> 
      <h2>Resumen de Compra</h2>
      <table className="cart-table">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Total</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          { //map items into rows
            cart.products.map((item) => ( 
              <tr key={item.productId}>
                <td>
                  <img src={item.thumbnail} alt={item.title} className="cart-item-thumbnail"/>
                </td>
                <td>{item.title}</td>
                <td>${item.price.toFixed(2)}</td>
                <td className="quantity-controls">
                  <button onClick={() => updateQuantity(item.productId, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, item.quantity + 1)}>+</button>
                </td>
                <td>
                  {item.discount > 0 ? (
                    <div>
                      <span className="pre-discount-price">
                        ${(item.price*item.quantity).toFixed(2)}
                      </span>
                      <br />
                      <span className='discounted-price'>
                        ${item.discountedTotal.toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    `$${(item.price*item.quantity).toFixed(2)}`
                  )}
                </td>
                <td>
                  <button onClick={() => removeItem(item.productId)} className="button-danger">
                    ❌
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      <h3>Total del Carrito: ${cart.discountedTotal.toFixed(2)}</h3>
      <div className="checkout-actions">
        <button onClick={() => {
          setView("shipping");
          setShippingCost(null);
        }}>Cotizar despacho</button>
        <button onClick={clearCart} className="button-secondary">Limpiar Carrito</button>
        <button onClick={() => setView('home')} className="button-secondary">Volver</button>
      </div>  
    </div>
  );
 };

 export default Checkout;
