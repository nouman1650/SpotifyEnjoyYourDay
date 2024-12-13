// Get modal elements
const loginModal = document.getElementById('loginModal');

const closeLogin = document.getElementById('closeLogin');

// Show signup modal

const loginBtn = document.querySelector(".loginbtn");
// Show login modal
loginBtn.addEventListener('click', () => {
    loginModal.style.display = 'block';
    window.location.href = '../index.html';
});

// Close login modal
closeLogin.addEventListener('click', () => {
    loginModal.style.display = 'none';
    window.location.href = '../index.html';
});

