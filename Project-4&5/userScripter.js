const API_BASE = "http://127.0.0.1:5001";

async function backend_helper(endpoint, options) {
    const response = await fetch(`${API_BASE}${endpoint}`, { credentials: 'include', ...options });
    const isAuthCall = endpoint === '/login' || endpoint === '/signup';
    if (response.status === 401 && !isAuthCall) {
        window.location.href = "login.html";
    }
    if (!response.ok) {
        const err = new Error(`HTTP error! Status: ${response.status}`);
        err.status = response.status;
        throw err;
    }
    let data = null;
    if (response.status !== 204) {
        try { data = await response.json(); } catch { data = null; }
    }
    return { status: response.status, data };
}

function logIn(){
    clean_errors();
    const loginform = document.getElementById('sign_in_log_in_form');
    let header = document.getElementById('form_header');
    header.textContent = "Log In!";
    document.getElementById('first_name_label').hidden = true;
    document.getElementById('first_name_text').hidden = true;
    document.getElementById('last_name_label').hidden = true;
    document.getElementById('last_name_text').hidden = true;
    document.getElementById('confirm_password_lable').hidden = true;
    document.getElementById('confirm_password_text').hidden = true;
    loginform.showModal();
}


function createAccount(){
    clean_errors();
    const loginform = document.getElementById('sign_in_log_in_form');
    let header = document.getElementById('form_header');
    header.textContent = "Create An Account!";
        document.getElementById('first_name_label').hidden = false;
    document.getElementById('first_name_text').hidden = false;
    document.getElementById('last_name_label').hidden = false;
    document.getElementById('last_name_text').hidden = false;
    document.getElementById('confirm_password_lable').hidden = false;
    document.getElementById('confirm_password_text').hidden = false;
    loginform.showModal();
}

function clean_errors(){
    document.getElementById('error_msg_holder').replaceChildren();
}

function makeError(error_msg){
    clean_errors();
    let error_box = document.getElementById("error_msg_holder");
    let error_child = document.createElement('p');
    error_child.textContent = error_msg;
    error_box.appendChild(error_child);
}

async function readForm(){
    clean_errors()
    // lets check to make sure the form is valid and then pass it on
    let password1 = document.getElementById('password_text');
    let password2 = document.getElementById('confirm_password_text');
    let email = document.getElementById('email_text');
    // pass the form along to the correct handeler
    let header = document.getElementById('form_header')
    if (header.textContent == "Create An Account!"){
        if (password1.value != password2.value){
            makeError("Waning passwords do not match");
            password1.value = "";
            password2.value = "";
            return;
        }
        await backend('/signup');
    }
    else if (header.textContent == "Log In!"){
        await backend('/login');
    }
    else{
        throw new Error("ERROR INVALID FORM TYPE")
    }
}

// (firstName, lastName, email, password, id)
function params_helper(){
    let firstName = document.getElementById('first_name_text');
    let LastName = document.getElementById('last_name_text');
    let Email = document.getElementById('email_text');
    let Password = document.getElementById('password_text');
    const body = {
            firstName: firstName.value, lastName: LastName.value,
            email: Email.value, password: Password.value
        };
    let params = { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
    return params
}

async function backend(endpoint) {
    try {
        await backend_helper(endpoint, params_helper());
        window.location.href = "dashboard.html";
    } catch (error) {
        if (error.status === 401) makeError("Incorrect email or password.");
        else if (error.status === 409) makeError("That email is already in use.");
        else makeError(`Something went wrong: ${error.message}`);
    }
}