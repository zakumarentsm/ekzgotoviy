class TutorsManager {
    constructor(api) {
        this.api = api;
        this.tutors = [];
        this.init();
    }

    async init() {
        try {
            await this.loadTutors();
            this.displayTutors();
        } catch (error) {
            console.error('Failed to initialize teachers:', error);
            showNotification('Ошибка при загрузке списка преподавателей', 'danger');
        }
    }

    async loadTutors() {
        try {
            // Используем тестовые данные
            this.tutors = [
                {
                    id: 1,
                    name: "Анна Петрова",
                    work_experience: 5,
                    languages_spoken: ["Русский", "Английский", "Французский"],
                    languages_offered: ["Русский", "Английский"],
                    language_levels: ["beginner", "intermediate", "advanced"],
                    price_per_hour: 2000,
                    available_days: ["monday", "wednesday", "friday"]
                },
                {
                    id: 2,
                    name: "Михаил Иванов",
                    work_experience: 8,
                    languages_spoken: ["Русский", "Английский", "Немецкий"],
                    languages_offered: ["Английский", "Немецкий"],
                    language_levels: ["intermediate", "advanced"],
                    price_per_hour: 2500,
                    available_days: ["tuesday", "thursday", "saturday"]
                },
                {
                    id: 3,
                    name: "Екатерина Смирнова",
                    work_experience: 6,
                    languages_spoken: ["Русский", "Испанский", "Итальянский"],
                    languages_offered: ["Испанский", "Итальянский"],
                    language_levels: ["beginner", "intermediate", "advanced"],
                    price_per_hour: 2200,
                    available_days: ["monday", "wednesday", "friday"]
                },
                {
                    id: 4,
                    name: "Александр Козлов",
                    work_experience: 10,
                    languages_spoken: ["Русский", "Китайский", "Английский"],
                    languages_offered: ["Китайский"],
                    language_levels: ["beginner", "intermediate", "advanced"],
                    price_per_hour: 3000,
                    available_days: ["tuesday", "thursday", "saturday"]
                },
                {
                    id: 5,
                    name: "Мария Соколова",
                    work_experience: 4,
                    languages_spoken: ["Русский", "Японский", "Английский"],
                    languages_offered: ["Японский"],
                    language_levels: ["beginner", "intermediate", "advanced"],
                    price_per_hour: 2800,
                    available_days: ["monday", "wednesday", "friday"]
                },
                {
                    id: 6,
                    name: "Дмитрий Новиков",
                    work_experience: 7,
                    languages_spoken: ["Русский", "Французский", "Английский"],
                    languages_offered: ["Французский"],
                    language_levels: ["beginner", "intermediate", "advanced"],
                    price_per_hour: 2400,
                    available_days: ["tuesday", "thursday", "saturday"]
                },
                {
                    id: 7,
                    name: "Ольга Морозова",
                    work_experience: 9,
                    languages_spoken: ["Русский", "Итальянский", "Испанский"],
                    languages_offered: ["Итальянский", "Испанский"],
                    language_levels: ["beginner", "intermediate", "advanced"],
                    price_per_hour: 2600,
                    available_days: ["monday", "wednesday", "friday"]
                },
                {
                    id: 8,
                    name: "Сергей Волков",
                    work_experience: 5,
                    languages_spoken: ["Русский", "Английский", "Немецкий"],
                    languages_offered: ["Английский"],
                    language_levels: ["beginner", "intermediate", "advanced"],
                    price_per_hour: 1800,
                    available_days: ["tuesday", "thursday", "saturday"]
                },
                {
                    id: 9,
                    name: "Наталья Кузнецова",
                    work_experience: 6,
                    languages_spoken: ["Русский", "Китайский", "Английский"],
                    languages_offered: ["Китайский"],
                    language_levels: ["beginner", "intermediate", "advanced"],
                    price_per_hour: 2700,
                    available_days: ["monday", "wednesday", "friday"]
                },
                {
                    id: 10,
                    name: "Андрей Попов",
                    work_experience: 4,
                    languages_spoken: ["Русский", "Японский", "Английский"],
                    languages_offered: ["Японский"],
                    language_levels: ["beginner", "intermediate", "advanced"],
                    price_per_hour: 2300,
                    available_days: ["tuesday", "thursday", "saturday"]
                },
                {
                    id: 11,
                    name: "Елена Васильева",
                    work_experience: 8,
                    languages_spoken: ["Русский", "Французский", "Итальянский"],
                    languages_offered: ["Французский", "Итальянский"],
                    language_levels: ["beginner", "intermediate", "advanced"],
                    price_per_hour: 2800,
                    available_days: ["monday", "wednesday", "friday"]
                },
                {
                    id: 12,
                    name: "Игорь Лебедев",
                    work_experience: 7,
                    languages_spoken: ["Русский", "Испанский", "Английский"],
                    languages_offered: ["Испанский"],
                    language_levels: ["beginner", "intermediate", "advanced"],
                    price_per_hour: 2400,
                    available_days: ["tuesday", "thursday", "saturday"]
                },
                {
                    id: 13,
                    name: "Татьяна Павлова",
                    work_experience: 5,
                    languages_spoken: ["Русский", "Английский", "Китайский"],
                    languages_offered: ["Английский", "Китайский"],
                    language_levels: ["beginner", "intermediate", "advanced"],
                    price_per_hour: 2100,
                    available_days: ["monday", "wednesday", "friday"]
                },
                {
                    id: 14,
                    name: "Максим Семенов",
                    work_experience: 6,
                    languages_spoken: ["Русский", "Японский", "Английский"],
                    languages_offered: ["Японский"],
                    language_levels: ["beginner", "intermediate", "advanced"],
                    price_per_hour: 2600,
                    available_days: ["tuesday", "thursday", "saturday"]
                },
                {
                    id: 15,
                    name: "Юлия Николаева",
                    work_experience: 9,
                    languages_spoken: ["Русский", "Французский", "Испанский"],
                    languages_offered: ["Французский", "Испанский"],
                    language_levels: ["beginner", "intermediate", "advanced"],
                    price_per_hour: 2900,
                    available_days: ["monday", "wednesday", "friday"]
                }
            ];
        } catch (error) {
            console.error('Error loading tutors:', error);
            throw error;
        }
    }

    displayTutors() {
        const tutorsList = document.getElementById('tutorsList');
        if (!tutorsList) return;

        tutorsList.innerHTML = '';

        if (this.tutors.length === 0) {
            tutorsList.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">Преподаватели не найдены</p>
                </div>
            `;
            return;
        }

        this.tutors.forEach(tutor => {
            const tutorCard = this.createTutorCard(tutor);
            tutorsList.appendChild(tutorCard);
        });
    }

    createTutorCard(tutor) {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4 mb-4';
        col.innerHTML = `
            <div class="card tutor-card h-100">
                <div class="card-body">
                    <h5 class="card-title">${tutor.name}</h5>
                    <div class="tutor-info">
                        <div class="d-flex flex-wrap justify-content-between">
                            <p class="me-2"><strong>Опыт:</strong> ${tutor.work_experience} лет</p>
                            <p><strong>Цена:</strong> ${tutor.price_per_hour}₽/час</p>
                        </div>
                        <p class="mb-2"><strong>Языки:</strong> ${tutor.languages_offered.join(', ')}</p>
                        <p><strong>Владение языками:</strong> ${tutor.languages_spoken.join(', ')}</p>
                        <p><strong>Уровни преподавания:</strong> ${this.formatLevels(tutor.language_levels)}</p>
                    </div>
                    <div class="mt-3">
                        <button class="btn btn-primary mt-3 w-100" onclick="tutorsManager.showOrderForm(${tutor.id})">
                            Записаться к преподавателю
                        </button>
                    </div>
                </div>
            </div>
        `;
        return col;
    }

    formatAvailableDays(days) {
        const daysMap = {
            'monday': 'Понедельник',
            'tuesday': 'Вторник',
            'wednesday': 'Среда',
            'thursday': 'Четверг',
            'friday': 'Пятница',
            'saturday': 'Суббота',
            'sunday': 'Воскресенье'
        };
        return days.map(day => daysMap[day]).join(', ');
    }

    formatLevels(levels) {
        const levelMap = {
            'beginner': 'Начальный',
            'intermediate': 'Средний',
            'advanced': 'Продвинутый'
        };
        return levels.map(level => levelMap[level]).join(', ');
    }

    showOrderForm(tutorId) {
        if (window.orderManager) {
            window.orderManager.showBookingForm(tutorId);
        } else {
            console.error('OrderManager not initialized');
        }
    }

    async showBookingForm(tutorId) {
        const tutor = this.tutors.find(t => t.id === tutorId);
        if (!tutor) return;

        const formData = {
            tutor_id: tutorId,
            name: document.getElementById('studentName')?.value,
            phone: document.getElementById('studentPhone')?.value,
            email: document.getElementById('studentEmail')?.value,
            date_start: document.getElementById('lessonDate')?.value,
            time_start: document.getElementById('lessonTime')?.value,
            format: document.getElementById('lessonType')?.value,
            price: tutor.price_per_hour
        };

        try {
            const order = await this.api.createOrder(formData);
            const modal = bootstrap.Modal.getInstance(document.getElementById('bookTutorModal'));
            modal.hide();
            showNotification('Вы успешно записались к преподавателю! Мы свяжемся с вами в ближайшее время.', 'success');
        } catch (error) {
            console.error('Error booking tutor:', error);
            showNotification('Ошибка при записи к преподавателю', 'danger');
        }
    }
} 