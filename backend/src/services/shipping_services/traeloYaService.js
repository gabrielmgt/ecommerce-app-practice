const axios = require("axios");

const getTraeloYaTarifa = async (cart, customerData) => {
    const url = "https://recruitment.weflapp.com/tarifier/traelo_ya";
    const apiKey = process.env.TRAELO_YA_API_KEY;
    
    const items = cart.map(item => ({
        quantity: item.quantity,
        value: item.price,
        volume: item.dimensions.width * item.dimensions.height * item.dimensions.depth //SUPUESTO volumen
    }));
    
    const waypoints = [
    {
        type: "PICK_UP",
        addressStreet: "Juan de Valiente 3630",
        city: "Vitacura",
        phone: "+569 1234 5678",
        name: "Tienda Flapp"
    },
    {
        type: "DROP_OFF",
        addressStreet: customerData.shipping_street,
        city: customerData.commune,
        phone: customerData.phone,
        name: customerData.name
    }
    ];
    
    try {
        const response = await axios.post(url, {items, waypoints}, {
        headers: {"X-Api-Key" : apiKey} 
        });
        console.log("TraeloYa Response:", response.data);
        return response.data;        
    } catch (error) {
        console.error("Error with TraeloYa API:", error.response? error.response.data : error.message);
        return {error: "No hay tarifas disponibles para el envío solicitado."};
    }
};


module.exports = {
    getTraeloYaTarifa,
};