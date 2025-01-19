class CoursesManager {
    constructor(api) {
        this.api = api;
        this.courses = [];
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.init();
    }

    async init() {
        try {
            await this.loadCourses();
            this.displayCourses(this.courses);
        } catch (error) {
            console.error('Failed to initialize courses:', error);
            showNotification('Ошибка при загрузке курсов', 'danger');
        }
    }

    async loadCourses() {
        try {
            this.courses = await this.api.getCourses();
        } catch (error) {
            console.error('Error loading courses:', error);
            throw error;
        }
    }

    displayCourses(courses) {
        const coursesList = document.getElementById('coursesList');
        coursesList.innerHTML = '';

        if (courses.length === 0) {
            coursesList.innerHTML = `
                <div class="col-12 text-center">
                    <p class="text-muted">Курсы не найдены</p>
                </div>
            `;
            return;
        }

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const coursesToShow = courses.slice(startIndex, endIndex);

        coursesToShow.forEach(course => {
            const courseElement = this.createCourseElement(course);
            coursesList.appendChild(courseElement);
        });

        this.updatePagination(courses.length);
    }

    createCourseElement(course) {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';
        col.innerHTML = `
            <div class="card course-card h-100">
                <div class="card-body">
                    <h5 class="card-title">${course.name}</h5>
                    <p class="card-text">${course.description}</p>
                    <ul class="list-unstyled">
                        <li>Преподаватель: ${course.teacher}</li>
                        <li>Уровень: ${course.level}</li>
                        <li>Длительность: ${course.total_length} недель</li>
                        <li>Часов в неделю: ${course.week_length}</li>
                    </ul>
                    <button class="btn btn-primary" onclick="coursesManager.showOrderForm(${course.id})">
                        Записаться на курс
                    </button>
                </div>
            </div>
        `;
        return col;
    }

    showOrderForm(courseId) {
        orderManager.showOrderForm(courseId);
    }

    updatePagination(totalItems) {
        const pagination = document.getElementById('coursePagination');
        const pageCount = Math.ceil(totalItems / this.itemsPerPage);
        
        pagination.innerHTML = '';
        
        if (pageCount <= 1) return;

        // Создаем пагинацию
        const paginationHTML = [];
        
        // Кнопка "Предыдущая"
        paginationHTML.push(`
            <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage - 1}">Предыдущая</a>
            </li>
        `);

        // Номера страниц
        for (let i = 1; i <= pageCount; i++) {
            paginationHTML.push(`
                <li class="page-item ${i === this.currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" data-page="${i}">${i}</a>
                </li>
            `);
        }

        // Кнопка "Следующая"
        paginationHTML.push(`
            <li class="page-item ${this.currentPage === pageCount ? 'disabled' : ''}">
                <a class="page-link" href="#" data-page="${this.currentPage + 1}">Следующая</a>
            </li>
        `);

        pagination.innerHTML = paginationHTML.join('');

        // Добавляем обработчики для кнопок пагинации
        pagination.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.dataset.page);
                if (page && page !== this.currentPage) {
                    this.currentPage = page;
                    this.displayCourses(this.courses);
                }
            });
        });
    }
} 