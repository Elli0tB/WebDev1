
// init variables
let inital_start = true;
let tool_tip = ["Wow I thought I was bad at this...", "Hey hey dont worry im sure youll get it next time...", "You know I've always wonderd what it would be like to be bad at something? ",
    "Well well well, how the turns have tabled", "Did you know pressing the button is how you play the game?", "Did you know Defect is the best Character from Slay The Spire 1?", "How many buttons have you pushed in your life? Im at 2^42 and counting!" ];
let win_tip = ["You did it, you did it, you did it, yay lo hicimos", "So you got games on your phone? or are you just going to keep playing this?", "Ya know my mom once told me I was gonna be the greatest game to ever live, do you think she was right?"];

function fetchRandomFactfromAPI() {
    const url = "https://uselessfacts.jsph.pl/api/v2/facts/random";
    
    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        return response.json();
        })
        .then(data => {
            console.log("got", data.text);
        return data.text;
        })
        .catch(error => {
            console.error("Fetch error:", error.message);
        });
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
    for (let count = 1; count < 4; count++) {
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

    if(button_count == 3){
        const newP = document.createElement("p")
        newP.textContent = "WOW YOU GOT ALL THREE BUTTONS!"
        container.appendChild(newP)
    }
    if(button_count == 0){
        const newP = document.createElement("p")
        newP.id = "Try_Again_TXT"
        newP.textContent = "wow you got zero buttons... here this ones one the house try again"
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

}

function cleanBoard(){
    try {
        document.getElementById("Game_Header").remove();   // throws here on first-ever run
        document.getElementById("Game_Text").remove();      // never reached if line above throws
        document.getElementById("Tool_Tip_Board").textContent = "";  // never reached either
    } 
    catch (error) {
        console.log("Nothing to clean yet:", error.message);
    }
}

function lostGame(){
    const Game_Board = document.getElementById("Game_Board");
    while (Game_Board.firstChild) {
        Game_Board.removeChild(Game_Board.firstChild);
    }
    
    // display a random fact

    const Tool_Tip_Board = document.getElementById("Tool_Tip_Board")
    const roll = Math.random();
    fetchRandomFactfromAPI().then(random_fact => {

        if (roll <=.1){
            Tool_Tip_Board.textContent = `${tool_tip[0]} ... Anyways here is a random fact to ease the loss: ${random_fact}`
        }
        else if (roll <=.2){
            Tool_Tip_Board.textContent = `${tool_tip[1]} ... Anyways here is a random fact to ease the loss: ${random_fact}`
        }
        else if (roll <=.3){
            Tool_Tip_Board.textContent = `${tool_tip[2]} ... Anyways here is a random fact to ease the loss: ${random_fact}`
        }
        else if (roll <=.4){
            Tool_Tip_Board.textContent = `${tool_tip[3]} ... Anyways here is a random fact to ease the loss: ${random_fact}`
        }
        else if (roll <=.5){
            Tool_Tip_Board.textContent = `${tool_tip[4]} ... Anyways here is a random fact to ease the loss: ${random_fact}`
        }
        else if (roll <=.6){
            Tool_Tip_Board.textContent = `${tool_tip[5]} ... Anyways here is a random fact to ease the loss ${random_fact}`
        }
        else if (roll >.6){
            Tool_Tip_Board.textContent = `${tool_tip[6]} ... Anyways here is a random fact to ease the loss: ${random_fact}`
        }
    });
}   

function MakeTimer(points, time, win_condition){
    // Set the initial time duration in seconds (e.g., 5 minutes = 300 seconds)
    let totalSeconds = time; 

    // Target the HTML display element
    const displayElement = document.getElementById("timer-display");

    // Start an interval that runs every 1000ms (1 second)
    const timerInterval = setInterval(() => {
    // 1. Calculate minutes and remaining seconds
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    // 2. Format the time to always show two digits (e.g., "05:09" instead of "5:9")
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    // 3. Update the HTML content
    displayElement.textContent = `${formattedMinutes}:${formattedSeconds}`;

    // 4. Check if the timer has finished
    if (WinCheck(points.count, win_condition) == true){
        clearInterval(timerInterval); // Stop the interval from running
        displayElement.textContent = "---VICTORY---";
    }
    else if (totalSeconds <= 0) {
        clearInterval(timerInterval); // Stop the interval from running
        displayElement.textContent = "---TIMES UP---";
        lostGame()
    } 
    else {
        totalSeconds--; // Decrement the time by 1 second
    }
    }, 1000);
}

function WinCheck(points, win_condition){
    if (points >= win_condition){       
        const Game_Board = document.getElementById("Game_Board");
    
        while (Game_Board.firstChild) {
            Game_Board.removeChild(Game_Board.firstChild);
        }

        // display a random fact
        const Tool_Tip_Board = document.getElementById("Tool_Tip_Board")
        const roll = Math.random();
        fetchRandomFactfromAPI().then(random_fact => {
            if (roll <=.33){
                Tool_Tip_Board.textContent = `${win_tip[0]} ... Anyways here is a random fact to reward the win: ${random_fact}`
            }
            else if (roll <=.66){
                Tool_Tip_Board.textContent = `${win_tip[1]} ... Anyways here is a random fact to reward the win: ${random_fact}`
            }
            else if (roll >.66){
                Tool_Tip_Board.textContent = `${win_tip[2]} ... Anyways here is a random fact to reward the win: ${random_fact}`
            }
        });
        return true;
       
    }
    return false;
}

function MakeButtons(clicked_buttons, container, timer){
    MakeTimer(clicked_buttons,timer,10)
    for (let count = 1; count < 11; count++) {
        // 1. Create the Button
        const newButton = document.createElement('button');

        // add attributes to the Button 
        newButton.textContent = `CLICK ME!!`;
        newButton.className = 'Minigame1_Button';
        newButton.id = `Minigame1_Button${count}`;
        newButton.style.top = `${Math.random() * 80}%`;
        newButton.style.left = `${Math.random() * 80}%`;
                    
        newButton.addEventListener('click', () => {newButton.remove(), clicked_buttons.count++});

        // 3. Append it to the DOM
        container.appendChild(newButton);
    }
}

function MakeVirusAndTrash(dropped_box, container, timer){
    MakeTimer(dropped_box,timer,1)
    const Virus = document.createElement('img');
    const Trash = document.createElement('img');

    // add attributes to the Virus and trash 
    Virus.id = 'Minigame_3_Virus';
    Trash.id = "Minigame_3_Trash";
    Virus.draggable = true
    Virus.src = 'computer_virus.png'
    Trash.src = 'trashcan.png'

    Virus.style.top = `${Math.random() * 80}%`;
    Virus.style.left = `${Math.random() * 40}%`;    
    
    Trash.style.top = `${Math.random() * 80}%`;
    Trash.style.left = `${55 + Math.random() * 35}%`;    
                    
    Virus.addEventListener('dragstart', (e) => { e.dataTransfer.setData('text/plain', e.target.id); });
    Trash.addEventListener('dragover', (e) => { e.preventDefault();});  
    Trash.addEventListener('drop', (e) => {
        e.preventDefault(); 
            
        // Retrieve the dragged element's ID and append it to the drop zone
        const data = e.dataTransfer.getData('text/plain');
        const draggedElement = document.getElementById(data);
            
        Trash.appendChild(draggedElement);
        dropped_box.count++;
    });
    container.appendChild(Virus)
    container.appendChild(Trash)
}

function OpenPopUpGame_1(){
    cleanBoard();
    let clicked_buttons = {count: 0}; 
    let timer = 5
    // lets make a little pop up window that will have a diffent back ground 
    // click all the butons before timer is out
    // on fail pull a random fact from API? 
    const Game_Container = document.getElementById("Button_Box")
    const Inner_Container = document.getElementById("Game_Board")
    let Game_Header = document.createElement('h3')
    let Game_Text = document.createElement('p')
    
    Game_Header.textContent = '----MINIGAME 1----'
    Game_Header.id = "Game_Header"
    Game_Text.textContent = 'Click start when reday, once you do you will have 5 seconds to click 10 randomly placed buttons in the box below'
    Game_Text.id = "Game_Text"

    Game_Container.appendChild(Game_Header);
    Game_Container.appendChild(Game_Text);

    //Here we will make out button loop that will spawn button and you got to click as amny as you can before time runs out
    let First_Button = document.createElement('button')
    First_Button.textContent = 'Start'
    First_Button.id = 'RandomGenButton'
    First_Button.addEventListener('click', () => {
        MakeButtons(clicked_buttons,Inner_Container,timer); 
        First_Button.remove();
    });
    Inner_Container.appendChild(First_Button);


}

function OpenPopUpGame_2(){
    cleanBoard();
    const Game_Container = document.getElementById("Button_Box")
    let Game_Header = document.createElement('h3')
    let Game_Text = document.createElement('p')
    
    Game_Header.textContent = '----MINIGAME 2----'
    Game_Header.id = "Game_Header"
    Game_Text.textContent = 'Click start when reday, once you do you will have 1 minute to... is that a sombrero, what is happingng?'
    Game_Text.id = "Game_Text"

    Game_Container.appendChild(Game_Header);
    Game_Container.appendChild(Game_Text);


    let video_box = document.getElementById("Game_Board")
    let Tool_Tip_Board = document.getElementById("Tool_Tip_Board")
    let tool_tip_text = document.createElement('p')
    tool_tip_text.textContent = "You erm weren't ment to see that..."
    const video = document.createElement('video');
    video.src = 'JustDance.mp4';
    video.controls = true; // Shows default play/pause bars
    video.addEventListener('playing', () => {Tool_Tip_Board.appendChild(tool_tip_text)});
    video.addEventListener('ended', () => {
        console.log("Video finished!"); video.remove(); tool_tip_text.remove();
    // e.g., clear the game board, call WinCheck, move to next step, etc.
    });
    video_box.appendChild(video);
    // Play the video
    video.play().catch(error => {
        console.log("Autoplay was prevented:", error);
    });
}

function OpenPopUpGame_3(){
    cleanBoard();
    let dropped_box = {count: 0};
    let timer = 2;
    // need to make the draggable-box and the drop zone
    const Game_Container = document.getElementById("Button_Box")
    const Inner_Container = document.getElementById("Game_Board")
    let Game_Header = document.createElement('h3')
    let Game_Text = document.createElement('p')
    
    Game_Header.textContent = '----MINIGAME 3----'
    Game_Header.id = "Game_Header"
    Game_Text.textContent = 'Click start when reday, once you do you will have 2 seconds to move the virus into the trashcan before it destroys your computer!'
    Game_Text.id = "Game_Text"

    Game_Container.appendChild(Game_Header);
    Game_Container.appendChild(Game_Text);

    let First_Button = document.createElement('button')
    First_Button.textContent = 'Start'
    First_Button.id = 'VirusBombButton'
    First_Button.addEventListener('click', () => {
        MakeVirusAndTrash(dropped_box,Inner_Container,timer); 
        First_Button.remove();
    });
    Inner_Container.appendChild(First_Button);

}
