class ExternalAPITool {
    constructor() {
      this.baseUrl = process.env.API_BASE_URL || 'http://localhost:5000/api';
    }
  
    async createClient(clientData) {
      try {
        const mockResponse = {
          success: true,
          client: {
            ...clientData,
            _id: `mock-id-${Math.random().toString(36).substr(2, 9)}`,
            status: 'active',
            enrollmentDate: new Date().toISOString()
          }
        };
        return JSON.stringify(mockResponse);
      } catch (error) {
        console.error('Error creating client:', error);
        return `Error creating client: ${error.message}`;
      }
    }
  
    async createOrder(orderData) {
      try {
        const mockResponse = {
          success: true,
          order: {
            ...orderData,
            _id: `mock-order-${Math.random().toString(36).substr(2, 9)}`,
            status: 'pending',
            orderDate: new Date().toISOString()
          }
        };
        return JSON.stringify(mockResponse);
      } catch (error) {
        console.error('Error creating order:', error);
        return `Error creating order: ${error.message}`;
      }
    }
  }
  
  export default ExternalAPITool;