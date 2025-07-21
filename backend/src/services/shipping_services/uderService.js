const axios = require("axios");

const getUderTarifa = async (cart, customerData) => {
  const url = 'https://recruitment.weflapp.com/tarifier/uder';
  const apiKey = process.env.UDER_API_KEY;

  const manifest_items = cart.map(item => ({
      name: item.title,
      quantity: item.quantity,
      price: item.price,
      dimensions: {
          length: item.dimensions.width, //SUPUESTO length corresponde a width 
          height: item.dimensions.height,
          depth: item.dimensions.depth,
      }
  }));

  const payload = {
    pickup_address: "Juan de Valiente 3630, Vitacura",
    pickup_name: "Tienda Flapp",
    pickup_phone_number: "+569 1234 5678",
    dropoff_address: `${customerData.shipping_street}, ${customerData.commune}`,
    dropoff_name: customerData.name,
    dropoff_phone_number: customerData.phone,
    manifest_items
  };

  try {
    const response = await axios.post(url, payload, {
      headers: { 'X-Api-Key': apiKey }
    });
    console.log('Uder Response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error with Uder API:', error.response ? error.response.data : error.message);
    return { error: 'No hay tarifas disponibles para el envío solicitado.' };
  }
};


module.exports = {
    getUderTarifa,
};