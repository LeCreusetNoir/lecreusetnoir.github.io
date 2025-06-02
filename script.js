const ACCESS_CODE = "LECREUSET2025";

function validateAccess() {
    const inputCode = document.getElementById('access-code').value.trim();
    const errorMessage = document.getElementById('error-message');

    if (inputCode === ACCESS_CODE) {
        document.getElementById('access-modal').style.display = 'none';
        document.getElementById('main-content').style.display = 'block';
        showSection('home');
    } else {
        errorMessage.textContent = "Code d'accès incorrect. Veuillez réessayer.";
    }
}

function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach((el) => {
        el.style.display = 'none';
    });

    const target = document.getElementById(sectionId);
    if (target) {
        target.style.display = 'block';
    }
}