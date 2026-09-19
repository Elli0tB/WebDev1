
// init variables
let inital_start = true;
let tool_tip = ["Wow I thought I was bad at this...", "Hey hey dont worry im sure youll get it next time...", "You know I've always wonderd what it would be like to be bad at something? ",
    "Well well well, how the turns have tabled", "Did you know pressing the button is how you play the game?", "Did you know Defect is the best Character from Slay The Spire 1?", "How many buttons have you pushed in your life? Im at 2^42 and counting!" ];
let random_fact = [];
let point_count = 0;

function fetchRandomFactfromAPI(api, ){
    TODO
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
    let chance = .5
    // okay here is what needs to happen I need to create a random amount of buttons and place them in order.
    // Just to keep this sane lets cap it at 5 buttons. With a the more buttons present the rarer it is for a button to appear
    for (let count = 1; count < 6; count++) {
    // 1. Create the Button
        if(Math.random() >= chance){   
            button_count++;
            chance += .08
            const newButton = document.createElement('button');

            // add attributes to the Button 
            newButton.textContent = `Play minigame ${count}?`;
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

function OpenPopUpGame(count){
    // this needs to get the id of the button and open its corisponding popup game
    if (count == 1){
        OpenPopUpGame_1();
        document.getElementById(`Button_${count}`).remove();
    }
     if (count == 2){
        OpenPopUpGame_2();
        document.getElementById(`Button_${count}`).remove();
    }
     if (count == 3){
        OpenPopUpGame_3();
        document.getElementById(`Button_${count}`).remove();
    }
     if (count == 4){
        OpenPopUpGame_4();
        document.getElementById(`Button_${count}`).remove();
    }
     if (count == 5){
        OpenPopUpGame_5();
        document.getElementById(`Button_${count}`).remove();
    }

}

function MakeTimer(Game_Container){

}
function WinCheck(points, win_condition){
    if (points >= win_condition){
        const Game_Container = document.getElementById("Button_Box");
        let Win_Msg = document.createElement('h3');
    
        Win_Msg.textContent = '----VICTORY---';
        Win_Msg.id = "Win_Msg";
        Game_Container.appendChild(Win_Msg);
    }
}

function MakeButtons(clicked_buttons, container){
    MakeTimer(container)
    for (let count = 1; count < 11; count++) {
        // 1. Create the Button
        const newButton = document.createElement('button');

        // add attributes to the Button 
        newButton.textContent = `CLICK ME!!`;
        newButton.className = 'Minigame1_Button';
        newButton.id = `Minigame1_Button${count}`;
                    
        newButton.addEventListener('click', () => {WinCheck(clicked_buttons, 9); newButton.remove(), clicked_buttons++});

        // 3. Append it to the DOM
        container.appendChild(newButton);
    }
}

function OpenPopUpGame_1(){
    let clicked_buttons = 0 
    // lets make a little pop up window that will have a diffent back ground 
    // click all the butons before timer is out
    // on fail pull a random fact from API? 
    const Game_Container = document.getElementById("Button_Box")
    const Inner_Container = document.getElementById("Game_Board")
    let Game_Header = document.createElement('h3')
    let Game_Text = document.createElement('p')
    
    Game_Header.textContent = '----MINIGAME 1----'
    Game_Header.id = "Game_Header"
    Game_Text.textContent = 'This game works by spawning a button that you must click within the timer.\n Here is the catch each time you click a button there is a change another one will spawn.\n Good luck clock is ticking '
    Game_Text.id = "Game_Text"

    Game_Container.appendChild(Game_Header);
    Game_Container.appendChild(Game_Text);

    //Here we will make out button loop that will spawn button and you got to click as amny as you can before time runs out
    let First_Button = document.createElement('button')
    First_Button.textContent = 'Start'
    First_Button.id = 'RandomGenButton'
    First_Button.addEventListener('click', () => {
        MakeButtons(clicked_buttons,Inner_Container); 
        First_Button.remove();
    });
    Inner_Container.appendChild(First_Button);


}

function OpenPopUpGame_2(){
    // this is actually just a gif that is funny 

}

function OpenPopUpGame_3(){
    // a drag and drop bomb mini game

}

function OpenPopUpGame_4(){
 // a mimick the sound mini game? 

}

function OpenPopUpGame_5(){
    // plays the bee movie but super fast
}