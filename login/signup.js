// Get buttons
const signupModal = document.getElementById('signupModal');
const signupBtn = document.querySelector('.signupbtn');

const closeSignup = document.getElementById('closeSignup');

signupBtn.addEventListener('click', () => {
    signupModal.style.display = 'block';
    window.location.href = '../index.html';
});

closeSignup.addEventListener('click', () => {
    signupModal.style.display = 'none';
    window.location.href = '../index.html';
});

