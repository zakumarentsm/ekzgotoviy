class MapManager {
    constructor() {
        this.map = null;
        this.markers = [];
        this.resources = [];
        this.userLocation = null;
        
        // Инициализация карты при загрузке страницы
        ymaps.ready(() => this.initMap());
    }

    async initMap() {
        // Создание карты
        this.map = new ymaps.Map('map', {
            center: [55.76, 37.64], // Москва
            zoom: 11,
            controls: ['zoomControl', 'searchControl', 'routeButtonControl']
        });

        // Определение местоположения пользователя
        await this.getUserLocation();
        
        // Загрузка тестовых данных
        await this.loadResources();
        
        // Добавление маркеров на карту
        this.showMarkers();
        
        // Инициализация фильтров
        this.initFilters();
    }

    async getUserLocation() {
        try {
            await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.userLocation = [position.coords.latitude, position.coords.longitude];
                        this.map.setCenter(this.userLocation);
                        resolve();
                    },
                    (error) => {
                        console.error('Ошибка определения местоположения:', error);
                        reject(error);
                    }
                );
            });
        } catch (error) {
            console.error('Не удалось определить местоположение');
        }
    }

    async loadResources() {
        // Тестовые данные
        this.resources = [
            {
                type: 'school',
                name: 'Языковая школа №1',
                location: [55.75, 37.63],
                description: 'Курсы русского языка для начинающих'
            },
            {
                type: 'library',
                name: 'Библиотека иностранной литературы',
                location: [55.76, 37.65],
                description: 'Большой выбор книг на разных языках'
            },
            {
                type: 'center',
                name: 'Культурный центр',
                location: [55.77, 37.64],
                description: 'Языковые клубы и мероприятия'
            }
        ];
    }

    showMarkers() {
        // Очистка существующих маркеров
        this.markers.forEach(marker => this.map.geoObjects.remove(marker));
        this.markers = [];

        // Добавление новых маркеров
        this.resources.forEach(resource => {
            if (this.isResourceVisible(resource)) {
                const marker = new ymaps.Placemark(resource.location, {
                    balloonContentHeader: resource.name,
                    balloonContentBody: resource.description,
                    hintContent: resource.name
                }, {
                    preset: this.getMarkerPreset(resource.type)
                });

                this.map.geoObjects.add(marker);
                this.markers.push(marker);
            }
        });
    }

    getMarkerPreset(type) {
        const presets = {
            school: 'islands#blueEducationIcon',
            library: 'islands#greenBookIcon',
            center: 'islands#redCultureIcon'
        };
        return presets[type] || 'islands#blueIcon';
    }

    isResourceVisible(resource) {
        // Проверка типа ресурса
        const typeCheckbox = document.getElementById(`filter${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}`);
        if (!typeCheckbox.checked) return false;

        // Проверка расстояния
        if (this.userLocation) {
            const distance = this.calculateDistance(this.userLocation, resource.location);
            const maxDistance = document.getElementById('distanceFilter').value;
            if (distance > maxDistance) return false;
        }

        return true;
    }

    calculateDistance(point1, point2) {
        // Расчет расстояния между точками в километрах
        return ymaps.coordSystem.geo.getDistance(point1, point2) / 1000;
    }

    initFilters() {
        // Обработчик изменения значения ползунка расстояния
        const distanceFilter = document.getElementById('distanceFilter');
        const distanceValue = document.getElementById('distanceValue');
        
        distanceFilter.addEventListener('input', () => {
            distanceValue.textContent = distanceFilter.value;
        });
    }

    applyFilters() {
        this.showMarkers();
    }
}

// Инициализация при загрузке страницы
let mapManager;
document.addEventListener('DOMContentLoaded', () => {
    mapManager = new MapManager();
});

// Функция для применения фильтров
function applyFilters() {
    if (mapManager) {
        mapManager.applyFilters();
    }
} 