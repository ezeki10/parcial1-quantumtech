/*
 * Archivo: formulario.js
 * Función: Realiza validación dinámica del formulario de contacto (lado del cliente).
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    
    // Función para mostrar mensajes de error y aplicar clase 'error'
    function displayError(inputElement, message) {
        const formGroup = inputElement.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');
        
        formGroup.classList.add('error');
        errorMessage.textContent = message;
    }

    // Función para limpiar mensajes de error y remover clase 'error'
    function clearError(inputElement) {
        const formGroup = inputElement.closest('.form-group');
        const errorMessage = formGroup.querySelector('.error-message');

        formGroup.classList.remove('error');
        errorMessage.textContent = '';
    }

    // Función principal de validación de un campo
    function validateField(inputElement) {
        const fieldName = inputElement.id;
        let isValid = true;
        let errorMessage = '';

        // 1. Validación de campos vacíos (required)
        if (inputElement.hasAttribute('required') && !inputElement.value.trim()) {
            isValid = false;
            // Genera un mensaje de error limpio usando la etiqueta previa
            const labelText = inputElement.previousElementSibling.textContent.replace(' *', '').replace(' (Opcional)', '').toLowerCase();
            errorMessage = `El campo '${labelText}' es obligatorio.`;
        } 
        
        // 2. Validación específica para Email (formato)
        else if (fieldName === 'email' && !inputElement.checkValidity()) {
            isValid = false;
            errorMessage = 'Por favor, introduce una dirección de correo válida (ejemplo@dominio.com).';
        } 
        
        // 3. Validación específica para Teléfono (formato, solo si tiene valor)
        else if (fieldName === 'telefono' && inputElement.value.trim() && !inputElement.checkValidity()) {
            isValid = false;
            errorMessage = 'El formato del teléfono es incorrecto (solo números, 8 a 15 dígitos).';
        }
        
        // 4. Validación específica para Nombre (longitud mínima)
        else if (fieldName === 'nombre' && inputElement.value.trim().length < 3) {
            isValid = false;
            errorMessage = 'El nombre debe tener al menos 3 caracteres.';
        }
        
        // 5. Validación específica para Mensaje (longitud mínima)
        else if (fieldName === 'mensaje' && inputElement.value.trim().length < 10) {
            isValid = false;
            errorMessage = 'El mensaje debe tener al menos 10 caracteres.';
        }
        
        // 6. Validación para Select/Interés (valor por defecto)
        else if (fieldName === 'interes' && inputElement.value === "") {
             isValid = false;
            errorMessage = 'Debes seleccionar un área de interés.';
        }

        if (!isValid) {
            displayError(inputElement, errorMessage);
            return false;
        } else {
            clearError(inputElement);
            return true;
        }
    }

    // Asignar listeners de validación en tiempo real (al perder el foco)
    form.querySelectorAll('input, select, textarea').forEach(input => {
        // Validación al perder el foco (blur)
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        // Validación al escribir, solo si el campo ya estaba en error
        input.addEventListener('input', () => {
             if (input.closest('.form-group').classList.contains('error')) {
                validateField(input);
            }
        });
    });

    // Manejar el evento de envío del formulario
    form.addEventListener('submit', function(event) {
        let formIsValid = true;
        let firstInvalidField = null;

        // Validar todos los campos necesarios antes de enviar
        form.querySelectorAll('input, select, textarea').forEach(input => {
            if (input.hasAttribute('required') || input.id === 'telefono' && input.value.trim()) {
                if (!validateField(input)) {
                    formIsValid = false;
                    if (!firstInvalidField) {
                        firstInvalidField = input;
                    }
                }
            }
        });

        if (!formIsValid) {
            event.preventDefault(); // Detener el envío si hay errores
            // Enfocar en el primer campo no válido para la mejor UX
            if (firstInvalidField) {
                firstInvalidField.focus();
            }
        }
        // Si formIsValid es true, el formulario se envía al action="../data/guardar.php"
    });
});