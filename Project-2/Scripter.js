
// init variables
let inital_start = true;


function getRandom(){
    Math.random
}

function TryAgain(){
    const try_again_txt = document.getElementById("Try_Again_TXT");
    const try_again_button = document.getElementById("Try_Again_Button");
    try_again_button.remove();
    try_again_txt.remove();
    Start();

}


function Start(){
    const container = document.getElementById('Button_Box');
    const start_lable = document.getElementById("Start_Lable");
    const start_button = document.getElementById("Start_Button");

    let button_count = 0;
    // okay here is what needs to happen I need to create a random amount of buttons and place them in order.
    // Just to keep this sane lets cap it at 5 buttons. With a the more buttons present the rarer it is for a button to appear
    for (let count = 1; count < 6; count++) {
    // 1. Create the Button
        if(Math.random() <= .5){   
            button_count++;
            const newButton = document.createElement('button');

            // add attributes to the Button 
            newButton.textContent = `Hello this is button number ${count}`;
            newButton.className = 'game_button';
            newButton.id = `Button_${count}`;
            
            newButton.addEventListener('click', () => OpenPopUpGame(count));

            // 3. Append it to the DOM
            container.appendChild(newButton);
        }
    }
    if (inital_start == true){
        start_button.remove();
        start_lable.remove();
        inital_start = false;
    }

    if(button_count == 5){
        const newP = document.createElement("p")
        newP.textContent = "WOW YOU GOT ALL FIVE BUTTONS!"
        container.appendChild(newP)
    }
    if(button_count == 0){
        const newP = document.createElement("p")
        newP.id = "Try_Again_TXT"
        newP.textContent = "wow you got 0 buttons... here this ones one the house try again"
        container.appendChild(newP)
        const newButton = document.createElement('button');
        newButton.textContent = "This ones on us try again...";
        newButton.className = 'game_button';
        newButton.id = "Try_Again_Button";
        newButton.addEventListener('click', () => TryAgain());
        container.appendChild(newButton)
    }
}

function OpenPopUpGame(self){
    // this needs to get the id of the button and open its corisponding popup game
    if (count == 1){
        OpenPopUpGame_1();
    }
     if (count == 2){
        OpenPopUpGame_2();
    }
     if (count == 3){
        OpenPopUpGame_3();
    }
     if (count == 4){
        OpenPopUpGame_4();
    }
     if (count == 5){
        OpenPopUpGame_5();
    }

}

function OpenPopUpGame_1(){
    // click all the butons before timer is out
    // on fail pull a random fact from API? 
}

function OpenPopUpGame_2(){
    // click the green buttons before the timmer is out

}

function OpenPopUpGame_3(){
    // a drag and drop bomb mini game

}

function OpenPopUpGame_4(){
 // a mimick the sound mini game? 

}

function OpenPopUpGame_5(){
    // claude ping pong? 
}