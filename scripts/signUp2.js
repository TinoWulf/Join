
const passwordField = document.getElementById("sign-up-password");
const toggleIcon = document.getElementById("eyePassword");
const passwordField2 = document.getElementById("confirmPassword");
const toggleIcon2 = document.getElementById("eyePassword2");
let realValue = "";
let isVisible = false;


/**
 * this listener toggles the visibility of the password icon when a user start typing in the password field
 */
passwordField.addEventListener("input", function () {
  toggleIcon.innerHTML = `<img src="./assets/icons/visibility_off.png" alt="lock">`;
});


/**
 * this listener toggles the visibility of the password icon when a user start typing in the password field
 */
passwordField2.addEventListener("input", function () {
  toggleIcon2.innerHTML = `<img src="./assets/icons/visibility_off.png" alt="lock">`;
});


/**
 * this listener change the visibility of the password value when a user typing in the password field
 */
passwordField.addEventListener("input", (e) => {
  const newValue = e.target.value;
  if (newValue.length < realValue.length) {
    realValue = realValue.slice(0, newValue.length);
  } else {
    realValue += newValue[newValue.length - 1];
  }
  passwordField.value = isVisible ? realValue : "*".repeat(realValue.length);
});

passwordField2.addEventListener("input", (e) => {
  const newValue = e.target.value;
  if (newValue.length < realValue.length) {
    realValue = realValue.slice(0, newValue.length);
  } else {
    realValue += newValue[newValue.length - 1];
  }
  passwordField2.value = isVisible ? realValue : "*".repeat(realValue.length);
});


/**
 * Toggles the visibility of the password input field.
 * Updates the input value to show either the real password or masked characters,
 * and switches the visibility icon accordingly.
 * @function
 * @global
 * @returns {void}
 */
function togglePassword() {
  isVisible = !isVisible;
  passwordField.value = isVisible ? realValue : "*".repeat(realValue.length);
  toggleIcon.innerHTML = isVisible
    ? `<img src="./assets/icons/visibility.png" alt="lock">`
    : `<img src="./assets/icons/visibility_off.png" alt="lock">`;
}


/**
 * Toggles the visibility of the password input field.
 * Updates the input value to show either the real password or masked characters,
 * and switches the visibility icon accordingly.
 *
 * @function
 * @global
 * @returns {void}
 */
function togglePasswordConfirm() {
  isVisible = !isVisible;
  passwordField2.value = isVisible ? realValue : "*".repeat(realValue.length);
  toggleIcon2.innerHTML = isVisible
    ? `<img src="./assets/icons/visibility.png" alt="lock">`
    : `<img src="./assets/icons/visibility_off.png" alt="lock">`;
}