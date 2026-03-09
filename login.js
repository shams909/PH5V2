//garbbbing the html elements we need 
const form = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const signinBtn = document.getElementById('signinBtn');
const btnText = document.querySelector('.btn-text');
const btnSpinner = document.getElementById('btnSpinner');
const errorMsg = document.getElementById('errorMsg');
const errorText = document.getElementById('errorText');

//demo credentials
const CORRECT_USERNAME = 'admin';
const CORRECT_PASSWORD = 'admin123';


// when the form is submitted
form.addEventListener('submit', function (event) {

  // prevents the browser from refreshing 
  event.preventDefault();

  // get what the fuck  the user typed 
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  // hides old error msg
  errorMsg.classList.add('hidden');

  //check if both fields are filled
  if (!username || !password) {
    errorText.textContent = 'Please fill in both fields.';
    errorMsg.classList.remove('hidden');
    return; // stops here
  }

  // shows the loading spinner
  btnText.classList.add('hidden');
  btnSpinner.classList.remove('hidden');
  signinBtn.disabled = true;

  // fakes a small "loading" delay of 1 second before checking
  setTimeout(function () {

    // checks the credentials
    if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {

      // ✅ Correct! Save to sessionStorage so main.html knows we're logged in
      sessionStorage.setItem('isLoggedIn', 'true');
      sessionStorage.setItem('username', username);

      // go to the main page
      window.location.href = 'main.html';

    } else {

      // wrong credentials -> show error
      errorText.textContent = 'Wrong username or password. Try: admin / admin123';
      errorMsg.classList.remove('hidden');

      // reset the button back to normal
      btnText.classList.remove('hidden');
      btnSpinner.classList.add('hidden');
      signinBtn.disabled = false;
    }

  }, 1000); // wait 1 second

});
