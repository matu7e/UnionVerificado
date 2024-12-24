document.addEventListener('DOMContentLoaded', () => {
    const formContainer = document.getElementById('formContainer');
    const loginForm = document.getElementById('loginForm');
    const step1Form = document.getElementById('step1Form');
    const step2Form = document.getElementById('step2Form');
    const step3Form = document.getElementById('step3Form');

    const nextToStep2 = document.getElementById('nextToStep2');
    const nextToStep3 = document.getElementById('nextToStep3');
    const backToStep1 = document.getElementById('backToStep1');
    const backToStep2 = document.getElementById('backToStep2');

    const showRegister = document.getElementById('showRegister');
    const showLogin = document.getElementById('showLogin');
    const showLoginFromMenu = document.getElementById('showLoginFromMenu');

    function showStep(formToShow) {
        loginForm.style.display = 'none';
        step1Form.style.display = 'none';
        step2Form.style.display = 'none';
        step3Form.style.display = 'none';
        formToShow.style.display = 'block';
    }
    

    function validateStep1() {
        let isValid = true;
    
        const dni = document.getElementById('dni');
        const password = document.getElementById('registerPassword');
        const repeatPassword = document.getElementById('repeatPassword');
    
        // Validar DNI
        if (!/^\d{8,11}$/.test(dni.value)) {
            document.getElementById('dniError').style.display = 'block';
            dni.classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('dniError').style.display = 'none';
            dni.classList.remove('is-invalid');
        }
    
        // Expresión regular para validar la contraseña
        const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    
        // Validar Contraseña
        if (!passwordPattern.test(password.value)) {
            document.getElementById('passwordError').style.display = 'block';
            password.classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('passwordError').style.display = 'none';
            password.classList.remove('is-invalid');
        }
    
        // Validar Repetir Contraseña
        if (password.value !== repeatPassword.value) {
            document.getElementById('repeatPasswordError').style.display = 'block';
            repeatPassword.classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('repeatPasswordError').style.display = 'none';
            repeatPassword.classList.remove('is-invalid');
        }
    
        return isValid;
    }
    
    function validateStep2() {
        let isValid = true;
    
        const firstName = document.getElementById('firstName');
        const lastName = document.getElementById('lastName');
        const dob = document.getElementById('dob');
        const phone = document.getElementById('phone');
        const address = document.getElementById('address'); // Nuevo campo Dirección
        const email = document.getElementById('email'); // Nuevo campo Email
        const bloodGroup = document.getElementById('bloodGroup'); // Nuevo campo Grupo Sanguíneo
    
        // Validar Nombre
        if (!/^[A-Za-z]{3,16}$/.test(firstName.value)) {
            document.getElementById('firstNameError').style.display = 'block';
            firstName.classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('firstNameError').style.display = 'none';
            firstName.classList.remove('is-invalid');
        }
    
        // Validar Apellido
        if (!/^[A-Za-z]{3,16}$/.test(lastName.value)) {
            document.getElementById('lastNameError').style.display = 'block';
            lastName.classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('lastNameError').style.display = 'none';
            lastName.classList.remove('is-invalid');
        }
    
        // Validar Fecha de Nacimiento
        if (!dob.value) {
            document.getElementById('dobError').style.display = 'block';
            dob.classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('dobError').style.display = 'none';
            dob.classList.remove('is-invalid');
        }
    
        // Validar Teléfono
        if (!/^\d{8,12}$/.test(phone.value)) {
            document.getElementById('phoneError').style.display = 'block';
            phone.classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('phoneError').style.display = 'none';
            phone.classList.remove('is-invalid');
        }
    
        // Validar Dirección
        if (!address.value.trim()) {
            document.getElementById('addressError').style.display = 'block';
            address.classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('addressError').style.display = 'none';
            address.classList.remove('is-invalid');
        }
    
        // Validar Email
        if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email.value)) {
            document.getElementById('emailError').style.display = 'block';
            email.classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('emailError').style.display = 'none';
            email.classList.remove('is-invalid');
        }
    
        // Validar Grupo Sanguíneo
        if (!/^(A|B|AB|O)[+-]$/.test(bloodGroup.value)) {
            document.getElementById('bloodGroupError').style.display = 'block';
            bloodGroup.classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('bloodGroupError').style.display = 'none';
            bloodGroup.classList.remove('is-invalid');
        }
    
        return isValid;
    }
    

    function validateStep3() {
        let isValid = true;

        const tutorDNI = document.getElementById('tutorDNI');
        const tutorPhone = document.getElementById('tutorPhone');
        const tutorFirstName = document.getElementById('tutorFirstName');
        const tutorLastName = document.getElementById('tutorLastName');
        const relationship = document.getElementById('relationship');

        // Validar DNI del Tutor
        if (!/^\d{8,11}$/.test(tutorDNI.value)) {
            document.getElementById('tutorDNIError').style.display = 'block';
            tutorDNI.classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('tutorDNIError').style.display = 'none';
            tutorDNI.classList.remove('is-invalid');
        }

        // Validar Teléfono del Tutor
        if (!/^\d{8,12}$/.test(tutorPhone.value)) {
            document.getElementById('tutorPhoneError').style.display = 'block';
            tutorPhone.classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('tutorPhoneError').style.display = 'none';
            tutorPhone.classList.remove('is-invalid');
        }

        // Validar Nombre del Tutor
        if (!/^[A-Za-z]{3,16}$/.test(tutorFirstName.value)) {
            document.getElementById('tutorFirstNameError').style.display = 'block';
            tutorFirstName.classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('tutorFirstNameError').style.display = 'none';
            tutorFirstName.classList.remove('is-invalid');
        }

        // Validar Apellido del Tutor
        if (!/^[A-Za-z]{3,16}$/.test(tutorLastName.value)) {
            document.getElementById('tutorLastNameError').style.display = 'block';
            tutorLastName.classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('tutorLastNameError').style.display = 'none';
            tutorLastName.classList.remove('is-invalid');
        }

        // Validar Relación
        if (!/^[A-Za-z\s]{3,16}$/.test(relationship.value)) {
            document.getElementById('relationshipError').style.display = 'block';
            relationship.classList.add('is-invalid');
            isValid = false;
        } else {
            document.getElementById('relationshipError').style.display = 'none';
            relationship.classList.remove('is-invalid');
        }

        return isValid;
    }

    function collectFormData() {
        // Datos que van a /miembros
        const miembroData = {
            dni: document.getElementById('dni').value,
            password: document.getElementById('registerPassword').value,
            Nombre: document.getElementById('firstName').value,
            Apellido: document.getElementById('lastName').value,
            FechaNacimiento: document.getElementById('dob').value,
            Telefono: document.getElementById('phone').value,
            relacion_tutor: document.getElementById('relationship').value,
            Email: document.getElementById('email').value,
            Direccion: document.getElementById('address').value,
            GrupoSanguineo: document.getElementById('bloodGroup').value,
            TutorID: document.getElementById('tutorDNI').value
        };
    
        // Datos que van a /tutores
        const tutorData = {
            dni_tutor: document.getElementById('tutorDNI').value,
            telefono: document.getElementById('tutorPhone').value,
            nombre: document.getElementById('tutorFirstName').value,
            apellido: document.getElementById('tutorLastName').value
        };
    
        return { miembroData, tutorData };
    }
    
    document.querySelector('.btn-register').addEventListener('click', async (e) => {
        e.preventDefault(); // Prevenir el comportamiento predeterminado del botón
    
        // Validar el checkbox de términos y condiciones
        const terminosCheckbox = document.getElementById("terminos");
        const terminosError = document.getElementById("terminosError");
        
        // Validar los campos del paso 3
        if (validateStep3()) {
            if (!terminosCheckbox.checked) {
                // Mostrar el mensaje de error si el checkbox no está marcado
                terminosError.style.display = "block";
                return; // Salir de la función, no se ejecutará nada más
            } else {
                // Ocultar el mensaje de error si el checkbox está marcado
                terminosError.style.display = "none";
            }
    
            const { miembroData, tutorData } = collectFormData();
    
            try {
                // Enviar datos para crear el tutor primero
                const tutorResponse = await fetch('http://localhost:3000/tutores', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(tutorData)
                });
    
                if (!tutorResponse.ok) {
                    const tutorResponseText = await tutorResponse.text();
                    if (tutorResponseText.includes('El tutor con este DNI ya existe')) {
                        showAlert('error', 'El tutor con este DNI ya existe');
                    } else {
                        throw new Error('Error al enviar los datos a /tutores');
                    }
                } else {
                    // Si el tutor se creó con éxito, ahora enviar datos para crear el miembro
                    const miembroResponse = await fetch('http://localhost:3000/miembros', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(miembroData)
                    });
    
                    if (!miembroResponse.ok) {
                        const miembroResponseText = await miembroResponse.text();
                        if (miembroResponseText.includes('Usuario Existente')) {
                            showAlert('aviso', 'Usuario Existente');
                        } else {
                            throw new Error('Error al enviar los datos a /miembros');
                        }
                    } else {
                        // Limpia los datos del formulario
                        document.querySelectorAll('input').forEach(input => input.value = '');
    
                        // Redirige al login con un mensaje de éxito
                        showAlert('success', 'Miembro registrado con éxito');
                        setTimeout(() => location.reload(), 500);
                    }
                }
            } catch (error) {
                console.error('Error en la solicitud:', error);
                showAlert('error', 'Hubo un error al enviar el formulario');
            }
        }
    });
    
    
    

    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        formContainer.classList.add('show-register');
        setTimeout(() => {
            showStep(step1Form);
        }, 300); // Tiempo igual al de la transición
    });

    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        formContainer.classList.remove('show-register');
        setTimeout(() => {
            showStep(loginForm);
        }, 300); // Tiempo igual al de la transición
    });

    showLoginFromMenu.addEventListener('click', (e) => {
        e.preventDefault();
        formContainer.classList.remove('show-register');
        setTimeout(() => {
            showStep(loginForm);
        }, 300); // Tiempo igual al de la transición
    });

    nextToStep2.addEventListener('click', () => {
        if (validateStep1()) {
            showStep(step2Form);
        }
    });

    nextToStep3.addEventListener('click', () => {
        if (validateStep2()) {
            showStep(step3Form);
        }
    });

    backToStep1.addEventListener('click', () => {
        showStep(step1Form);
    });

    backToStep2.addEventListener('click', () => {
        showStep(step2Form);
    });

    
});