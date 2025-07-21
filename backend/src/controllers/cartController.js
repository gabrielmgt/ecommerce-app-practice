const { fetchAllProducts } = require('../services/dummyJsonService');
const { getTraeloYaRate } = require('../services/shippingService/traeloYaService');
const { getUderRate } = require('../services/shippingService/uderService');


const processCart = async (req, res) => {
	//paso a.  recibir carrito random y customer 
  const { products: cartProducts, customer_data } = req.body;

  try {      
    // paso b. obtener totalidad de productos utilizando paginación 10 en 10 
    const allProducts = await fetchAllProducts();
    
    const allProductsMap = new Map(allProducts.map(p => [p.id.toString(), p]));
    
    // paso c. procesar carrito 
    const processedProducts = cartProducts.map(item => {
      const productDetails = allProductsMap.get(item.productId);
      if (!productDetails) {
        throw new Error(`Producto de ID ${item.productId} no encontrado.`);
      }
      const realStock = Math.floor(productDetails.stock / productDetails.rating);
      return {
        ...item,
        name: productDetails.title,
        stock: productDetails.stock,
        rating: productDetails.rating,
        realStock,
        dimensions: productDetails.dimensions
      };
    });

    // paso d. log a consola
	/*
		id
		nombre
		precio por unidad 
		descuento total 
		cantidad
		stock 
		rating
		stock real 
	*/
    console.log("--- Cart Details ---");
    processedProducts.forEach(p => {
      console.log(
        `ID: ${p.productId}, Name: ${p.name}, Price: ${p.price}, Discount: ${p.discount}, ` +
        `Quantity: ${p.quantity}, Stock: ${p.stock}, Rating: ${p.rating}, Real Stock: ${p.realStock}`
      );
    });
    console.log("--------------------");



    // paso e. verificacion de stock para cada prdoucto con el stock real 
    
    for (const product of processedProducts) {
      if (product.quantity > product.realStock) {
        return res.status(400).json({
          error: `No se puede satisfacer stock para producto ${product.name}. Cantidad: ${product.quantity}, Stock Real: ${product.realStock}`
        });
      }
    }
      

    // paso f. realizar tarificacion a servicios de shipping 
    const [traeloYaResult, uderResult] = await Promise.all([
      getTraeloYaRate(processedProducts, customer_data),
      getUderRate(processedProducts, customer_data)
    ]);

    // paso g. obtener el precio mas bajo de las tarifas encontradas
	/*
		courier
		price
	*/
    const rates = [];
    if (traeloYaResult && !traeloYaResult.error) {
      rates.push({ courier: 'TraeloYa', price: traeloYaResult.deliveryOffers.pricing.total });
    }
    if (uderResult && !uderResult.error) {
      rates.push({ courier: 'Uder', price: uderResult.fee });
    }
	
	//paso h.
    if (rates.length === 0) {
      return res.status(400).json({ error: 'No hay tarifas disponibles para el envío solicitado.' });
    }

    const bestRate = rates.reduce((min, rate) => rate.price < min.price ? rate : min, rates[0]);

    res.json(bestRate);

  } catch (error) {
    console.error('Error procesando carrito:', error);
    res.status(500).json({ error: error.message || 'Error interno de servidor' });
  }
};

module.exports = {
  processCart,
};