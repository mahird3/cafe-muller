// login.js

// Hard-coded credentials
const correctUsername = 'caglarmete';
const correctPassword = 'mahir';

document.getElementById('login-form').addEventListener('submit', function(e) {
  e.preventDefault(); // Prevent form submission
  
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  
  if(username === correctUsername && password === correctPassword) {
    // Successful login: hide login screen, show main content
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('main-content').style.display = 'block';
  } else {
    // Show error message
    document.getElementById('login-error').textContent = 'Invalid username or password.';
  }
});
