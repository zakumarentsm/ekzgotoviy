let api;
let currentCourse;

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация API с вашим ключом
    api = new API('24cc2df2-1b5b-4745-a1d6-fde04bf717ba');
    
    // Загрузка курсов
    loadCourses();
});

async function loadCourses() {
    try {
        const courses = await api.getCourses();
        console.log('Loaded courses:', courses); // Для отладки
        
        const coursesList = document.getElementById('coursesList');
        if (!coursesList) return;

        if (!Array.isArray(courses) || courses.length === 0) {
            coursesList.innerHTML = '<div class="col-12 text-center"><p class="text-muted">Курсы не найдены</p></div>';
            return;
        }

        coursesList.innerHTML = courses.map(course => `
            <div class="col-md-4 mb-4">
                <div class="card course-card h-100">
                    <div class="card-body">
                        <h5 class="card-title">${course.name}</h5>
                        <p class="card-text">${course.description}</p>
                        <div class="course-info">
                            <p><strong>Преподаватель:</strong> ${course.teacher}</p>
                            <p><strong>Уровень:</strong> ${formatLevel(course.level)}</p>
                            <p><strong>Длительность:</strong> ${course.total_length} недель</p>
                            <p><strong>Часов в неделю:</strong> ${course.week_length}</p>
                            <p><strong>Стоимость:</strong> ${course.course_fee_per_hour} ₽/час</p>
                        </div>
                        <button class="btn btn-primary mt-3 w-100" onclick='showOrderForm(${JSON.stringify(course).replace(/'/g, "\\'")})'>
                            Записаться на курс
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Ошибка при загрузке курсов:', error);
        const coursesList = document.getElementById('coursesList');
        if (coursesList) {
            coursesList.innerHTML = '<div class="col-12 text-center"><p class="text-danger">Ошибка при загрузке курсов</p></div>';
        }
        showNotification('Ошибка при загрузке курсов', 'danger');
    }
}

function formatLevel(level) {
    const levels = {
        'beginner': 'Начальный',
        'intermediate': 'Средний',
        'advanced': 'Продвинутый'
    };
    return levels[level] || level;
}

function showNotification(message, type = 'success') {
    const notifications = document.getElementById('notifications') || createNotificationsContainer();
    
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show`;
    notification.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    notifications.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 5000);
}

function createNotificationsContainer() {
    const container = document.createElement('div');
    container.id = 'notifications';
    container.className = 'position-fixed top-0 end-0 p-3';
    document.body.appendChild(container);
    return container;
}

function showOrderForm(course) {
    currentCourse = course;
    const modal = new bootstrap.Modal(document.getElementById('bookCourseModal'));
    const form = document.getElementById('bookCourseForm');
    
    // Заполняем скрытые поля
    form.querySelector('#courseId').value = course.id;
    form.querySelector('#courseName').value = course.name;
    form.querySelector('#courseTeacher').value = course.teacher;

    // Заполняем даты
    const dateSelect = form.querySelector('#startDate');
    dateSelect.innerHTML = course.start_dates.map(date => {
        const formattedDate = new Date(date).toLocaleDateString('ru-RU');
        return `<option value="${date}">${formattedDate}</option>`;
    }).join('');

    // Сбрасываем чекбоксы
    form.querySelector('#supplementary').checked = false;
    form.querySelector('#assessment').checked = false;

    // Сбрасываем количество студентов
    form.querySelector('#studentsCount').value = 1;

    // Обновляем цену
    updateOrderPrice(course);

    modal.show();
}

function updateOrderPrice(course) {
    if (!course) return;

    const form = document.getElementById('bookCourseForm');
    const studentsCount = parseInt(form.querySelector('#studentsCount').value) || 1;
    const startDate = form.querySelector('#startDate').value;
    const selectedTime = form.querySelector('#startTime').value;
    const supplementary = form.querySelector('#supplementary').checked;
    const assessment = form.querySelector('#assessment').checked;
    
    // Базовая стоимость
    let totalHours = course.total_length * course.week_length;
    let price = course.course_fee_per_hour * totalHours;

    // Наценка за выходные
    if (startDate && isWeekendDate(startDate)) {
        price *= 1.5;
    }

    // Наценка за время
    const hour = parseInt(selectedTime.split(':')[0]);
    if (hour >= 9 && hour < 12) {
        price += 400; // Утренние часы
    } else if (hour >= 18 && hour <= 20) {
        price += 1000; // Вечерние часы
    }

    // Умножаем на количество студентов
    price *= studentsCount;

    // Групповая скидка (если 5 и более студентов)
    if (studentsCount >= 5) {
        price *= 0.85; // Скидка 15%
    }

    // Скидка за раннюю регистрацию
    if (startDate) {
        const registrationDate = new Date(startDate);
        const today = new Date();
        const daysDiff = Math.ceil((registrationDate - today) / (1000 * 60 * 60 * 24));
        if (daysDiff >= 30) {
            price *= 0.9; // Скидка 10%
        }
    }

    // Дополнительные опции
    if (supplementary) {
        price += 2000 * studentsCount;
    }
    if (assessment) {
        price += 300 * studentsCount;
    }

    // Округляем до целых
    price = Math.round(price);

    document.getElementById('totalPrice').textContent = `${price} ₽`;
}

async function submitOrder(event) {
    event.preventDefault();
    const form = document.getElementById('bookCourseForm');
    
    const orderData = {
        id: Date.now(),
        course_id: currentCourse.id,
        course_name: currentCourse.name,
        teacher: currentCourse.teacher,
        date_start: form.querySelector('#startDate').value.split('T')[0],
        time_start: form.querySelector('#startTime').value,
        persons: parseInt(form.querySelector('#studentsCount').value),
        price: parseInt(document.getElementById('totalPrice').textContent.replace(/[^\d]/g, '')),
        format: form.querySelector('#courseFormat').value,
        supplementary: form.querySelector('#supplementary').checked,
        assessment: form.querySelector('#assessment').checked,
        status: 'created',
        created_at: new Date().toISOString()
    };

    try {
        // Сохраняем заявку
        let orders = [];
        const existingOrders = localStorage.getItem('orders');
        if (existingOrders) {
            orders = JSON.parse(existingOrders);
        }
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));

        console.log('Заявка сохранена:', orderData);

        // Закрываем модальное окно
        const modal = bootstrap.Modal.getInstance(document.getElementById('bookCourseModal'));
        modal.hide();

        // Показываем уведомление
        showNotification('Заявка успешно создана!', 'success');

        // Ждем 2 секунды перед переходом
        setTimeout(() => {
            showNotification('Переходим в личный кабинет...', 'info');
            setTimeout(() => {
                window.location.href = 'cabinet.html#applications';
            }, 1000);
        }, 2000);

    } catch (error) {
        console.error('Ошибка при сохранении заявки:', error);
        showNotification('Ошибка при отправке заявки', 'danger');
    }
}

function isWeekendDate(dateString) {
    const date = new Date(dateString);
    return date.getDay() === 0 || date.getDay() === 6;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
} 