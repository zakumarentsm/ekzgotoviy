class OrderManager {
    constructor(api) {
        this.api = api;
        this.currentTutor = null;
        this.bookingModal = null;
        this.init();
    }

    init() {
        this.bookingModal = new bootstrap.Modal(document.getElementById('bookTutorModal'));
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('confirmBooking').addEventListener('click', () => this.submitBooking());
        
        // Очистка формы при закрытии модального окна
        document.getElementById('bookTutorModal').addEventListener('hidden.bs.modal', () => {
            document.getElementById('bookTutorForm').reset();
            this.currentTutor = null;
        });
    }

    showBookingForm(tutorId) {
        this.currentTutor = tutorId;
        this.bookingModal.show();
    }

    async submitBooking() {
        const form = document.getElementById('bookTutorForm');
        
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const formData = {
            tutorId: this.currentTutor,
            studentName: document.getElementById('studentName').value,
            studentPhone: document.getElementById('studentPhone').value,
            lessonDate: document.getElementById('lessonDate').value,
            lessonTime: document.getElementById('lessonTime').value,
            lessonDuration: document.getElementById('lessonDuration').value,
            lessonType: document.getElementById('lessonType').value,
            status: 'pending'
        };

        try {
            await this.api.createOrder(formData);
            this.bookingModal.hide();
            showNotification('Заявка успешно отправлена! Мы свяжемся с вами для подтверждения.', 'success');
        } catch (error) {
            console.error('Error creating order:', error);
            showNotification('Произошла ошибка при отправке заявки. Попробуйте позже.', 'danger');
        }
    }

    validateDateTime(date, time) {
        const selectedDateTime = new Date(`${date}T${time}`);
        const now = new Date();
        
        // Проверка, что выбранное время не в прошлом
        if (selectedDateTime <= now) {
            return false;
        }
        
        // Проверка рабочих часов (9:00 - 21:00)
        const hours = selectedDateTime.getHours();
        if (hours < 9 || hours >= 21) {
            return false;
        }
        
        return true;
    }
} 