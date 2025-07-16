// Funcionalidades adicionales para el login
document.addEventListener('DOMContentLoaded', function() {
    // Mejorar la experiencia del usuario
    const inputs = document.querySelectorAll('.form-input');
    
    inputs.forEach(input => {
        // Agregar efecto de focus
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
        
        // Validación en tiempo real
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                this.classList.remove('error');
                const errorMsg = this.parentElement.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.style.display = 'none';
                }
            }
        });
    });
});
