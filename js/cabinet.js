class CabinetManager {
    constructor(api) {
        this.api = api;
        this.initializeEventListeners();
        this.loadOrders();
    }

    initializeEventListeners() {
        // Фильтр по статусу
        document.getElementById('statusFilter').addEventListener('change', () => {
            this.loadOrders();
        });
    }

    async loadOrders() {
        try {
            const orders = await this.api.getOrders();
            const statusFilter = document.getElementById('statusFilter').value;
            
            const filteredOrders = statusFilter === 'all' 
                ? orders 
                : orders.filter(order => order.status === statusFilter);

            this.displayOrders(filteredOrders);
        } catch (error) {
            console.error('Ошибка при загрузке заявок:', error);
        }
    }

    displayOrders(orders) {
        const ordersList = document.getElementById('ordersList');
        
        if (orders.length === 0) {
            ordersList.innerHTML = '<div class="col-12"><p class="text-center">Заявок пока нет</p></div>';
            return;
        }

        ordersList.innerHTML = orders.map(order => `
            <div class="col-md-6 mb-4">
                <div class="card order-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-3">
                            <h5 class="card-title">${order.courseName || 'Курс'}</h5>
                            <span class="badge ${this.getStatusBadgeClass(order.status)}">
                                ${this.getStatusText(order.status)}
                            </span>
                        </div>
                        <p class="card-text">
                            <strong>Дата:</strong> ${new Date(order.date_start).toLocaleDateString()}<br>
                            <strong>Время:</strong> ${order.time_start}<br>
                            <strong>Количество человек:</strong> ${order.persons}<br>
                            <strong>Стоимость:</strong> ${order.price} ₽
                        </p>
                        ${this.getOrderActions(order)}
                    </div>
                </div>
            </div>
        `).join('');

        // Добавляем обработчики для кнопок
        this.addButtonHandlers();
    }

    getStatusBadgeClass(status) {
        const classes = {
            new: 'bg-primary',
            confirmed: 'bg-success',
            completed: 'bg-info',
            cancelled: 'bg-danger'
        };
        return classes[status] || 'bg-secondary';
    }

    getStatusText(status) {
        const texts = {
            new: 'Новая',
            confirmed: 'Подтверждена',
            completed: 'Завершена',
            cancelled: 'Отменена'
        };
        return texts[status] || status;
    }

    getOrderActions(order) {
        if (order.status === 'new') {
            return `
                <div class="mt-3">
                    <button class="btn btn-success btn-sm me-2" onclick="cabinetManager.updateOrderStatus(${order.id}, 'confirmed')">
                        Подтвердить
                    </button>
                    <button class="btn btn-danger btn-sm" onclick="cabinetManager.updateOrderStatus(${order.id}, 'cancelled')">
                        Отменить
                    </button>
                </div>
            `;
        }
        return '';
    }

    async updateOrderStatus(orderId, status) {
        try {
            await this.api.updateOrder(orderId, status);
            this.loadOrders();
        } catch (error) {
            console.error('Ошибка при обновлении статуса:', error);
        }
    }

    addButtonHandlers() {
        // Обработчики уже добавлены через onclick в HTML
    }
}

// Инициализация при загрузке страницы
let cabinetManager;
document.addEventListener('DOMContentLoaded', () => {
    const api = new API();
    cabinetManager = new CabinetManager(api);
}); 