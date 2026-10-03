function updateMessages(response_data){
    // now we need to print and update
    //console.log(response_data)
    let message_log = document.getElementById('Message_Log');

    //clean the board and remake it 
    //actaully it would be better to just add the new msg since we cant delete but thats more work so we will pass for now
    message_log.replaceChildren();

    // need to create a <li id = 'item-1'>message</li> per message
    for (let msg_pointer = 0; msg_pointer < response_data.length; msg_pointer++){
        let message = document.createElement('li');
        message.id = `Message_${msg_pointer}`;
        message.textContent = `${response_data[msg_pointer]}`
        message_log.appendChild(message)
    }
}

function getAPI(){
    document.getElementById('Message_Response_Text').textContent = "If just reading isnt up to snuff for you, feel free to upload your own messages"
    fetch('http://127.0.0.1:5000/messages')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json(); // Parses JSON response into a JavaScript object
        })
        .then(data => updateMessages(data))
        .catch(error => console.error('Error fetching data:', error));
    //GET request 
}

function postToAPI(message){
    message = message.trim()
    if (message == ""){
        console.error(`ERROR: ${message} invalid, text must be present`)
        document.getElementById('Message_Response_Text').textContent = "Hey common you gotta type something..."
        return
    }
    if (message =="What would you like to say?"){
        console.error(`ERROR: ${message} invalid, you are a comedian, hardy har`)
        document.getElementById('Message_Response_Text').textContent = "Oh ha ha real funny, I'll show you!"
        let message_log = document.getElementById('Message_Log');
        let count = message_log.childElementCount;
        message_log.replaceChildren();    
        for (let msg_pointer = 0; msg_pointer < count; msg_pointer++){
            let message = document.createElement('li');
            message.id = `Message_${msg_pointer}`;
            message.textContent = `What would you like to say????? whos laughing now!!!`
            message_log.appendChild(message)
        }
        return
    }
    if (message =="something" || message == "Something"){
        console.error(`ERROR: ${message} invalid, you are a comedian, hardy har`)
        document.getElementById('Message_Response_Text').textContent = "Oh ha ha real funny, I'll show you!"
        let message_log = document.getElementById('Message_Log');
        let count = message_log.childElementCount;
        message_log.replaceChildren();    
        for (let msg_pointer = 0; msg_pointer < count; msg_pointer++){
            let message_obj = document.createElement('li');
            message_obj.id = `Message_${msg_pointer}`;
            message_obj.textContent = `${message}????? whos laughing now!!!`
            message_log.appendChild(message_obj)
        }
        return
    }
    if (message =="what would you like to say?"){
        console.error(`ERROR: ${message} invalid, why do you care so much, or do you just not capitalize?`)
        document.getElementById('Message_Response_Text').textContent = "I dont even know what to say... fine whatever I guess"
    }
    fetch('http://127.0.0.1:5000/messages', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(`${message}`)
        })
        .then(response => {
            if (!response.ok){
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        })
        .then(getAPI)
        .catch(error => console.error('Error posting data:', error))
        // POST request  
}

function fetchAPI(method,message){
    if (method == 'GET'){
        getAPI();
    }
    else if (method == 'POST'){
        postToAPI(message);
    }
    else{
        console.error(`ERROR: ${method} invalid, only GET and POST are valid methods`)
    }
}