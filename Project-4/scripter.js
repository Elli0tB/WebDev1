async function backend_helper(endpoint, options) {
    const response = await fetch(endpoint, options);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = response.status === 204 ? null : await response.json();
    return { status: response.status, data: data };
}
// id, name, char_class, combat_style, abilities, playability_status, lore
function generate_form(form_type){
    clean_form()
    let form_box = document.getElementById('form_box');
    let name_txt = document.createElement('input').type = 'text';
    name_txt.id = 'form_name_txt_input';
    let class_txt = document.createElement('input').type = 'text';
    name_txt.id = 'form_class_txt_input';
    let combat_style_txt = document.createElement('input').type = 'text';
    name_txt.id = 'form_combat_style_txt_input';
    let abilities_txt = document.createElement('input').type = 'text';
    name_txt.id = 'form_abilities_txt_input';
    let playability_txt = document.createElement('input').type = 'text';
    name_txt.id = 'form_playability_txt_input';
    let lore_txt = document.createElement('input').type = 'text';
    name_txt.id = 'form_lore_txt_input';
    let submit_button = document.createElement('button');
    submit_button.textContent = 'Submit';
    submit_button.id = 'form_submit_button';
    submit_button.onclick = function() {
        read_form(form_type)
    };
    form_box.appendChild(name_txt);
    form_box.appendChild(class_txt);
    form_box.appendChild(combat_style_txt);
    form_box.appendChild(abilities_txt);
    form_box.appendChild(playability_txt);
    form_box.appendChild(lore_txt);

}

async function read_form(form_type){
    const name_value = document.getElementById('form_name_txt_input').value;
    const class_value = document.getElementById('form_class_txt_input').value;
    const combat_style_value = document.getElementById('form_combat_style_txt_input').value;
    const abilities_value = document.getElementById('form_abilities_txt_input').value;
    const playability_value = document.getElementById('form_playability_txt_input').value;
    const lore_value = document.getElementById('form_lore_txt_input').value;
    let char_list = [name_value,class_value,combat_style_value,abilities_value,playability_value,lore_value];
    for(index = 0; index < char_list.length; index++){
        if (char_list[index] = "N/A"){
            submit_error_to_user("N/A in form input");
            return;
        }
    }
    if (form_type == "Creation"){
        await create_character_call_back(char_list);
    }
    else if (form_type == "Modification"){
        await modify_character_call_back(char_list);
    }
    else if (form_type == "Deletion"){
        await delete_character_call_back(char_list);
    }
    else { 
       Error('PANIC! FATLE ERROR GOT A INVALD METHOD OF READING');
    }
    // this will read the values in the inputs and make it into a usable array and hand it into an array that is sent to its handeller 
    
}

function clean_form(){
    const name_input = document.getElementById('form_name_txt_input');
    const class_input = document.getElementById('form_class_txt_input');
    const combat_style_input = document.getElementById('form_combat_style_txt_input');
    const abilities_input = document.getElementById('form_abilities_txt_input');
    const playability_input = document.getElementById('form_playability_txt_input');
    const lore_input = document.getElementById('form_lore_txt_input');

    name_input.remove();
    class_input.remove();
    combat_style_input.remove();
    abilities_input.remove();
    playability_input.remove();
    lore_input.remove();
    // and it will clean up the form
}

function submit_error_to_user(Error_type){
    
    if (Error_type == "N/A in form input"){
        const dialog = document.getElementById('invalid_input');
        dialog.showModal()

    }
    else if (Error_type == "empty value in creation"){
        const dialog = document.getElementById('character_creation_empty_feild');
        dialog.showModal()
    }
    else{
        Error("GOT A ERROR OF INVALID TYPE")
    }
}

function search_display(characters){
    let character_log = document.getElementById('character_log');
    for(let index = 0; index < characters.length; index++){
        let character = document.createElement('li');
        character.textContent = 
        `Character ID: ${characters[0]},
         Name: ${characters[1]}, 
         Class: ${characters[2]}, 
         Combat Style: ${characters[3]}, 
         Abilities: ${characters[4]},
         Playability Status: ${characters[5]}, 
         Lore:${characters[6]}
        `
        character_log.appendChild(character);
    }
}

async function SearchCharacters(name){
    document.getElementById('character_log').replaceChildren();
    let response;
    let params = {method: 'GET'};
    try{
        if (name == ""){
            response = await backend_helper('http://127.0.0.1:5000/character',params);
        }
        else{ 
            response = await backend_helper(`http://127.0.0.1:5000/character/${name}`,params);
            }
        search_display(response);
    }
    catch(error){
        console.error('Search failed:', error);
    }
    
}

function CreateCharacter(){
    generate_form("Creation");
   // construct a form that has a box for each character attribute. 
}

// char info is an array of 5 items
async function create_character_call_back(char_info){
    let valid = true;
    for (let index = 0; index < char_info.length; index++){
        if (char_info[index] =''){
            // this is an error for creation but not modification
            submit_error_to_user("empty value in creation");
            valid = false;
        }
    }
    
    if (valid = true){
        let params = { method: 'POST', headers: { "Content-Type": "application/json"}, body: JSON.stringify(`${message}`)};
        try{
            let response_json = await backend_helper(`http://127.0.0.1:5000/character/${char_info[1]}`,params);
            let response = response_json.json();
            if (response.status != 201){
                throw new Error(`HTTP error! Status: ${response.status} instead of 201!`)
              
            }
            else{ 
                document.getElementById('response_text').textContent = "Success! Your character has been uploaded"
            }
        }
        catch(error){
            document.getElementById('response_text').textContent = `ERROR! Your character has failed to upload: ${error.message}`;
        }
    }   
}

function ModifyCharacter(){
    generate_form("Modification");

}

// char info is an array of 5 items
async function modify_character_call_back(char_info){
    let path = 'PUT'
    for (let index = 0; index < char_info.length; index++){
        if (char_info[index] =''){
            char_info[index] = "N/A"
            path = "PATCH"
        }
    }
    let params = { method: `${path}`, headers: { "Content-Type": "application/json"}, body: JSON.stringify(`${message}`)};
    try{
        let response_json = await backend_helper(`http://127.0.0.1:5000/character/${char_info[1]}`,params);
        let response = response_json.json();
        if (response.status != 201){
            throw new Error(`HTTP error! Status: ${response.status} instead of 201!`)
        }
        else{ 
            document.getElementById(response_text).textContent = "Success! Your character has been uploaded"
        }
    }
    catch(error){
        document.getElementById('response_text').textContent = `ERROR! Your character has failed to upload: ${error.message}`;

    }
}

function DeleteCharacter(){
    generate_form("Deletion");
}

async function delete_character_call_back(name){
    let params = {method: 'DELETE'};
    try {
        let response_json = await backend_helper(`http://127.0.0.1:5000/character/${char_info[1]}`,params);
        let response = response_json.json();
        if (response[1] != 204){
            throw new Error(`HTTP error! Status: ${response.status} instead of 204!`)
        }
        else{ 
            document.getElementById(response_text).textContent = "Success! Your character has been deleted"
        }
    }
    catch(error){
        document.getElementById('response_text').textContent = `ERROR! Your character has failed to upload: ${error.message}`;
    }
}
