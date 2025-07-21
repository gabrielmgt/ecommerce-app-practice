const request = require('supertest');
const app = require('../app');
const dummyJsonService = require('../services/dummyJsonService');
const getTraeloYaService = require('../services/shipping_services/traeloYaService');
const getUderService = require('../services/shipping_services/uderService');

jest.mock('../services/dummyJsonService');
jest.mock('../services/shipping_services/traeloYaService');
jest.mock('../services/shipping_services/uderService');

describe('POST /api/cart', () => {
  let mockCartRequest;

  beforeEach(() => {
    jest.clearAllMocks();

    //valid test cart body
    mockCartRequest = {
      products: [
        { productId: '1', price: 100, quantity: 2, discount: 10 },
      ],
      customer_data: {
        name: 'Test',
        shipping_street: 'Calle Falsa 123',
        commune: 'Test',
        phone: '+56912345678',
      },
    };
  });
  
  
  //Test 1: Request exitoso
  test('Cuando todos los couriers responden y hay stock, retornar el courier con la menor tarifa', async () => {
    //mock datos de servicios para fetch de dummyjson y servicios de tarifa
    dummyJsonService.fetchAllProducts.mockResolvedValue([
      { id: 1, title: 'Test Product', stock: 50, rating: 4, dimensions: { width: 1, height: 1, depth: 1 } },
    ]);
    getTraeloYaService.getTraeloYaTarifa.mockResolvedValue({
      deliveryOffers: { pricing: { total: 2500 } },
    });
    getUderService.getUderTarifa.mockResolvedValue({
      fee: 3000,
    });

    //realizar request a /api/cart
    const response = await request(app)
      .post('/api/cart')
      .send(mockCartRequest);

    //check que haya retornado courier TraeloYa y precio 2500
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      courier: 'TraeloYa',
      price: 2500,
    });
  });
  
  //Test 2: No hay realStock para quantity
  test('Respuesta retorna error 400 si no hay stock y mensaje indica no stock en respuesta', async () => {
	  
	//mock data para un request con realStock de math.floor(10 / 5) = 2 y quantity de 3
    dummyJsonService.fetchAllProducts.mockResolvedValue([
      { id: 1, title: 'Test Product', stock: 10, rating: 5, dimensions: { width: 1, height: 1, depth: 1 } },
    ]);
    mockCartRequest.products[0].quantity = 3; 

    //realizar request a /api/cart
    const response = await request(app)
      .post('/api/cart')
      .send(mockCartRequest);

    //check que respuesta sea 400 y mensaje de error indique no stock 
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toContain('No se puede satisfacer stock para producto');
  });
  
  
  //Test 3: No hay tarifas disponibles para ambos servicios
  test('Respuesta retorna error 400 y mensaje indica que no hay tarifas disponibles', async () => {
    
	//mock data 
    dummyJsonService.fetchAllProducts.mockResolvedValue([
      { id: 1, title: 'Test Product', stock: 50, rating: 4, dimensions: { width: 1, height: 1, depth: 1 } },
    ]);
	
    //Servicios retornan objeto con mensaje de error del catch de los servicios 
    getTraeloYaService.getTraeloYaTarifa.mockResolvedValue({
      error: 'No hay tarifas disponibles para el envío solicitado.',
    });
    getUderService.getUderTarifa.mockResolvedValue({
      error: 'No hay tarifas disponibles para el envío solicitado.',
    });

    //realizar request a /api/cart
    const response = await request(app)
      .post('/api/cart')
      .send(mockCartRequest);

    //check que respuesta sea 400 y mensaje de error indique no hay tarifas  
    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('No hay tarifas disponibles para el envío solicitado.');
  });
  
  //Test 4: No hay producto para ID 
  test('Sanity check para ID invalido de producto', async () => {
	//mock data
	dummyJsonService.fetchAllProducts.mockResolvedValue([
      { id: 1, title: 'Product ID 1', stock: 10, rating: 1, dimensions: { width: 1, height: 1, depth: 1 } },
    ]);
	
	mockCartRequest.products[0].productId = -1; 
	
    //realizar request a /api/cart
    const response = await request(app)
      .post('/api/cart')
      .send(mockCartRequest);
	  
	//check que respuesta sea 500 y mensaje de error interno  
    expect(response.statusCode).toBe(500);
    expect(response.body).toHaveProperty('error');
    expect(response.body.error).toBe('Producto de ID -1 no encontrado.');
  });
});
  