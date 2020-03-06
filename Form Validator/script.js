const form = document.getElementById("form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const password2 = document.getElementById("password2");

//Input Error Message
function showError(input, message) {
  const formControl = input.parentElement;
  formControl.className = "form-control error";
  const small = formControl.querySelector("small");
  small.innerText = message;
}

//Success Outline
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = "form-control success";
}

//Email Validity
function checkEmail(input) {
  const re = /^[a-zA-z][a-zA-Z0-9\.\-\_]{4,}\@[a-z]+\.[a-z]{2,3}$/;
  if (re.test(input.value)) {
    showSuccess(input);
  } else {
    showError(input, "Email not valid");
  }
}

//Check if all fields are filled
function checkRequired(inputArr) {
  inputArr.forEach(function(input) {
    if (input.value === "") {
      showError(input, `${getFieldName(input)} is required`);
    } else {
      showSuccess(input);
    }
  });
}

//Field Name
function getFieldName(input) {
  return input.id.charAt(0).toUpperCase() + input.id.slice(1);
}

//Check Length for Username and Password
function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(
      input,
      `${getFieldName(input)} should be atleast ${min} characters`
    );
  } else if (input.value.length > max) {
    showError(
      input,
      `${getFieldName(input)} should not exceed ${max} characters`
    );
  } else {
    showSuccess(input);
  }
}

//Password Match
function checkPasswordMatch(pass1, pass2) {
  if (pass1.value !== pass2.value) {
    showError(pass2, "Passwords do not match");
  }
}

//Submit Event Listener
form.addEventListener("submit", function(e) {
  e.preventDefault();

  checkRequired([username, email, password, password2]);
  checkLength(username, 3, 15);
  checkLength(password, 6, 20);
  checkEmail(email);
  checkPasswordMatch(password, password2);
});
