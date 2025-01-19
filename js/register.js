document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');

    // Обработчик переключения видимости пароля
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        togglePassword.querySelector('i').classList.toggle('fa-eye');
        togglePassword.querySelector('i').classList.toggle('fa-eye-slash');
    });

    toggleConfirmPassword.addEventListener('click', () => {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        toggleConfirmPassword.querySelector('i').classList.toggle('fa-eye');
        toggleConfirmPassword.querySelector('i').classList.toggle('fa-eye-slash');
    });

    // Обработчик отправки формы
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Проверка совпадения паролей
        if (passwordInput.value !== confirmPasswordInput.value) {
            showNotification('Пароли не совпадают', 'danger');
            return;
        }

        // Проверка сложности пароля
        if (!isPasswordStrong(passwordInput.value)) {
            showNotification('Пароль должен содержать минимум 8 символов, включая буквы, цифры и специальные символы', 'danger');
            return;
        }

        const formData = {
            name: document.getElementById('name').value,
            surname: document.getElementById('surname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            password: passwordInput.value
        };

        try {
            // В реальном приложении здесь будет отправка данных на сервер
            console.log('Отправка данных регистрации:', formData);
            
            showNotification('Регистрация успешно завершена! Выполняется перенаправление...', 'success');
            
            // Перенаправление на страницу входа через 2 секунды
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            
        } catch (error) {
            console.error('Error during registration:', error);
            showNotification('Ошибка при регистрации. Попробуйте позже.', 'danger');
        }
    });
});

function isPasswordStrong(password) {
    // Минимум 8 символов, минимум 1 буква, 1 цифра и 1 специальный символ
    const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    return strongPasswordRegex.test(password);
}

function showNotification(message, type = 'success') {
    const notifications = document.getElementById('notifications');
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