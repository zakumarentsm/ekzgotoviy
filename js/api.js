class API {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'http://cat-facts-api.std-900.ist.mospolytech.ru/api';
    }

    async request(endpoint, options = {}) {
        try {
            const url = `${this.baseUrl}${endpoint}?api_key=${this.apiKey}`;
            console.log('Request URL:', url); // Для отладки
            
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error Data:', errorData); // Для отладки
                throw new Error(`API Error: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    }

    // Получение списка курсов
    async getCourses() {
        return this.request('/courses');
    }

    // Получение информации о конкретном курсе
    async getCourse(courseId) {
        return this.request(`/course/${courseId}`);
    }

    // Получение списка заявок
    async getOrders() {
        // Получаем заявки из localStorage
        return JSON.parse(localStorage.getItem('orders') || '[]');
    }

    // Получение конкретной заявки
    async getOrder(orderId) {
        return this.request(`/orders/${orderId}`);
    }

    // Создание заявки
    async createOrder(orderData) {
        // Сохраняем заявку в localStorage для демонстрации
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const newOrder = {
            id: Date.now(),
            ...orderData,
            status: 'new',
            created_at: new Date().toISOString()
        };
        orders.push(newOrder);
        localStorage.setItem('orders', JSON.stringify(orders));
        return newOrder;
    }

    // Обновление заявки
    async updateOrder(orderId, status) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const updatedOrders = orders.map(order => 
            order.id === orderId ? { ...order, status } : order
        );
        localStorage.setItem('orders', JSON.stringify(updatedOrders));
        return { success: true };
    }

    // Удаление заявки
    async deleteOrder(orderId) {
        return this.request(`/orders/${orderId}`, {
            method: 'DELETE'
        });
    }
}