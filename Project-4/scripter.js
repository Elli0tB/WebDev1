async function backend_helper(endpoint, options) {
    const response = await fetch(endpoint, options);
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = response.status === 204 ? null : await response.json();
    return { status: response.status, data: data };
}
// id, name, char_class, combat_style, abilities, playability_status, lore
function generate_form(form_type, character = null){
    clean_form()
    let form_box = document.getElementById('form_box');

    let form_header = document.createElement('h3');
    form_header.textContent = `Character ${form_type} Form`;

    let name_txt = document.createElement('input');
    name_txt.type = 'text';
    name_txt.id = 'form_name_txt_input';
    let name_label = document.createElement('label');
    name_label.textContent = 'Name:';
    name_label.setAttribute('for', 'form_name_txt_input');

    let class_txt = document.createElement('input');
    class_txt.type = 'text';
    class_txt.id = 'form_class_txt_input';
    let class_label = document.createElement('label');
    class_label.textContent = 'Class:';
    class_label.setAttribute('for', 'form_class_txt_input');


    let combat_style_txt = document.createElement('input');
    combat_style_txt.type = 'text';
    combat_style_txt.id = 'form_combat_style_txt_input';
    let combat_style_label = document.createElement('label');
    combat_style_label.textContent = 'Combat Style:';
    combat_style_label.setAttribute('for', 'form_combat_style_txt_input');

    let abilities_txt = document.createElement('input');
    abilities_txt.type = 'text';
    abilities_txt.id = 'form_abilities_txt_input';
    let abilities_label = document.createElement('label');
    abilities_label.textContent = 'Abilities:';
    abilities_label.setAttribute('for', 'form_abilities_txt_input');

    let playability_txt = document.createElement('input');
    playability_txt.type = 'text';
    playability_txt.id = 'form_playability_txt_input';
    let playability_label = document.createElement('label');
    playability_label.textContent = 'Playability Status:';
    playability_label.setAttribute('for', 'form_playability_txt_input');

    let lore_txt = document.createElement('textarea');
    lore_txt.id = 'form_lore_txt_input';
    let lore_label = document.createElement('label');
    lore_label.textContent = 'Lore:';
    lore_label.setAttribute('for', 'form_lore_txt_input');

    let submit_button = document.createElement('button');
    submit_button.textContent = 'Submit';
    submit_button.id = 'form_submit_button';
   

    submit_button.onclick = function() {
        read_form(form_type)
    };

    if (character) {
        name_txt.value = character.name;
        name_txt.readOnly = true;   // the name is the lookup key, so it can't be edited
        class_txt.value = character.char_class;
        combat_style_txt.value = character.combat_style;
        abilities_txt.value = character.abilities;
        playability_txt.value = character.playability_status;
        lore_txt.value = character.lore;
    }

    form_box.appendChild(form_header);

    form_box.appendChild(name_label);
    form_box.appendChild(name_txt);
    form_box.appendChild(document.createElement('br'));

    form_box.appendChild(class_label);
    form_box.appendChild(class_txt);
    form_box.appendChild(document.createElement('br'));

    form_box.appendChild(combat_style_label);
    form_box.appendChild(combat_style_txt);
    form_box.appendChild(document.createElement('br'));

    form_box.appendChild(abilities_label);
    form_box.appendChild(abilities_txt);
    form_box.appendChild(document.createElement('br'));
    
    form_box.appendChild(playability_label);
    form_box.appendChild(playability_txt);
    form_box.appendChild(document.createElement('br'));

    form_box.appendChild(lore_label);
    form_box.appendChild(lore_txt);
    form_box.appendChild(document.createElement('br'));

    form_box.appendChild(submit_button);

}

async function read_form(form_type){
    const name_value = document.getElementById('form_name_txt_input').value;
    const class_value = document.getElementById('form_class_txt_input').value;
    const combat_style_value = document.getElementById('form_combat_style_txt_input').value;
    const abilities_value = document.getElementById('form_abilities_txt_input').value;
    const playability_value = document.getElementById('form_playability_txt_input').value;
    const lore_value = document.getElementById('form_lore_txt_input').value;
    let char_list = [name_value,class_value,combat_style_value,abilities_value,playability_value,lore_value];
    for(let index = 0; index < char_list.length; index++){
        if (char_list[index] == "N/A"){
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
    else { 
       throw new Error('PANIC! FATLE ERROR GOT A INVALD METHOD OF READING');
    }
    // this will read the values in the inputs and make it into a usable array and hand it into an array that is sent to its handeller 
    clean_form();
}

function clean_form(){
    document.getElementById('form_box').replaceChildren();
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
        throw new Error("GOT A ERROR OF INVALID TYPE")
    }
}

// add to dev journal
function search_display(data){
    const characters = Array.isArray(data) ? data : [data];
    let character_log = document.getElementById('character_log');
    for (const c of characters){
        let li = document.createElement('li');
        li.innerHTML = `Character ID: ${c.id},<br> Name: ${c.name},<br> Class: ${c.char_class},<br> Combat Style: ${c.combat_style},<br> Abilities: ${c.abilities},<br> Playability Status: ${c.playability_status},<br> Lore: ${c.lore}<br>`;
        
        let edit_button = document.createElement('button');
        edit_button.textContent = 'Edit';
        edit_button.onclick = () => ModifyCharacter(c);
        li.appendChild(edit_button);
        
        character_log.appendChild(li);
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
            response = await backend_helper(`http://127.0.0.1:5000/character/${encodeURIComponent(name)}`,params);
            }
        search_display(response.data);
    }
    catch(error){
        console.error('Search failed:', error);
        document.getElementById('response_text').textContent = `ERROR!: ${error}`;
    }
    
}

function CreateCharacter(){
    generate_form("Creation");
   // construct a form that has a box for each character attribute. 
}

// char info is an array of 6 items
async function create_character_call_back(char_info){
    let valid = true;
    for (let index = 0; index < char_info.length; index++){
        if (char_info[index] ==''){
            // this is an error for creation but not modification
            submit_error_to_user("empty value in creation");
            valid = false;
        }
    }
    
    if (valid == true){
        let params = { method: 'POST', headers: { "Content-Type": "application/json"}, body: JSON.stringify(char_info)};
        try{
            let response = await backend_helper(`http://127.0.0.1:5000/character/${encodeURIComponent(char_info[0])}`,params);
            if (response.status != 201){
                throw new Error(`HTTP error! Status: ${response.status} instead of 201!`)
              
            }
            else{ 
                document.getElementById('response_text').textContent = "Success! Your character has been uploaded"
            }
        }
        catch(error){
            document.getElementById('response_text').textContent = `ERROR! Your character has failed to upload due to: ${error}`;
        }
    }   
    SearchCharacters("");

}

function ModifyCharacter(char){
    generate_form("Modification",char);
}

// char info is an array of 6 items
async function modify_character_call_back(char_info){
    let path = 'PUT'
    for (let index = 0; index < char_info.length; index++){
        if (char_info[index] ==''){
            char_info[index] = "N/A"
            path = "PATCH"
        }
    }
    const body = {
    char_class: char_info[1], combat_style: char_info[2],
    abilities: char_info[3], playability_status: char_info[4], lore: char_info[5]
    };
    let params = { method: path, headers: {"Content-Type": "application/json"}, body: JSON.stringify(body) };
    try{
        let response = await backend_helper(`http://127.0.0.1:5000/character/${encodeURIComponent(char_info[0])}`,params);
        if (response.status != 204){
            throw new Error(`HTTP error! Status: ${response.status} instead of 204!`)
        }
        else{ 
            document.getElementById('response_text').textContent = "Success! Your character has been uploaded"
        }
    }
    catch(error){
        document.getElementById('response_text').textContent = `ERROR! Your character has failed to upload due to: ${error}`;

    }
    SearchCharacters("");
}

function DeleteCharacter(name){
    const dialog = document.getElementById('delete_confirmation');
    dialog.returnValue = '';   // clear any answer left over from last time

    dialog.addEventListener('close', () => {
        if (dialog.returnValue === 'confirm') {
            delete_character_call_back(name);
        }
    }, { once: true });
    document.getElementById('delete_target').textContent = `Character: ${name}`;
    dialog.showModal();
}

async function delete_character_call_back(name){
    let params = {method: 'DELETE'};
    try {
        let response = await backend_helper(`http://127.0.0.1:5000/character/${encodeURIComponent(name)}`,params);
        if (response.status != 204){
            throw new Error(`HTTP error! Status: ${response.status} instead of 204!`)
        }
        else{ 
            document.getElementById('response_text').textContent = "Success! Your character has been deleted"
        }
    }
    catch(error){
        document.getElementById('response_text').textContent = `ERROR! Your character has failed to delete due to: ${error}`;
    }
    SearchCharacters("");

}

