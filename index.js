let board = document.querySelector(".board");
let FoodY;
let FoodX;
let SnakeX = 3;
let SnakeY = 4;
let SnakeBody = [[2,4]];
let velocityX = 0;
let velocityY = 0;
let GameOver = false;
let getScore = document.getElementById("score")
let getHighscore = document.getElementById("highscore")
let gameOverSound = new Audio("Sounds/gameover-sound.mp3");
let turnSound = new Audio("Sounds/click-sound4.mp3");
let eatSound = new Audio("Sounds/eating-sound4.mp3");
//let setIntervalID;
let gameOverText = document.getElementById('g-over')
let keys = document.querySelectorAll(".key")
let soundbtn = document.getElementById("sound") 
let playbtn =  document.getElementById("play")

console.log(playbtn)

//checking whether local stoarge contain high score json object or not if then setting it up
if(JSON.parse(localStorage.getItem('HighScore')) === null)
{
 localStorage.setItem("HighScore",JSON.stringify("0"))
}  

//extracting score part from text string in html
score = parseInt(getScore.innerHTML.slice(8,))

//Extracting high score form local storage
highsc= JSON.parse(localStorage.getItem('HighScore'))

console.log(score,highsc)

console.log(getScore)

//generating random cordinates for food position 
function FoodPosition(){
    FoodX = Math.floor(Math.random()*14)+1;
    FoodY= Math.floor(Math.random()*14)+1;
}

//moving snake when key is pressed
function moveSnake(e){    //e contains the detail related to pressed key
    if(e.key=="ArrowUp" && velocityY != 1){
        velocityX  = 0
        velocityY = -1 
        
    }
    else if(e.key=="ArrowDown" && velocityY != -1){
        velocityX = 0
        velocityY = 1
    }
    else if(e.key=="ArrowLeft" && velocityX != 1){
        velocityX = -1
        velocityY = 0 
    }
    else if(e.key=="ArrowRight" && velocityX != -1){
        velocityX = 1
        velocityY = 0 
    }
    main()

    return turnSound.play()

}

//moving snake through UI keys
//console.log(keys[0].dataset.key)

keys.forEach((key)=>{
    key.addEventListener("click",function keyPass(){moveSnake({key:key.dataset.key})})
})

console.log(keys)

 //Updating to when it is reset
 getHighscore.innerHTML = getHighscore.innerHTML.slice(0,13) + highsc

function main() {

    //Set snake position
    SnakeX += velocityX;
    SnakeY += velocityY;

    //pushing coordinates into the snake body array when it will eat food
    if(SnakeX === FoodX && SnakeY === FoodY) {
        FoodPosition()
        eatSound.volume =0.3
        eatSound.play()
        SnakeBody.push([FoodX,FoodY])

        //Upadting score and upating it to UI
        score += 1
        getScore.innerHTML = getScore.innerHTML.slice(0,8)+score

        //console.log(score)
        //console.log(SnakeBody.length)
        //console.log(SnakeBody)
    } 

    //Moving snake ahead only when snake body is increased fist time
    for(let i = SnakeBody.length-1; i > 0; i--){  //i value is already 1 bcoz main() is called in global scope
        SnakeBody[i] = SnakeBody[i-1]
       // console.log("i"+i)  
    }
    //console.log(SnakeBody)
    
    //Setting food in grid box using row and column no
    let setHtml = `<div class="food" style="grid-area: ${FoodY}/${FoodX};"></div>`

    //intial place of snake
    SnakeBody[0] = [SnakeX,SnakeY]
    //console.log(SnakeBody)  
    
    //defining snake head
    for(let i = 0; i < SnakeBody.length;i++){
        setHtml+= `<div class="snake-body" id="snake-head${i}" style="grid-area: ${SnakeBody[i][1]}/${SnakeBody[i][0]};"></div>`

        //when snake head will touch his own body
        if(i != 0 && SnakeBody[0][1] === SnakeBody[i][1] && SnakeBody[0][0] === SnakeBody[i][0]){
            return showGameOver()
        }
    }

    //when snake will touch the boundary
    if(SnakeX <= 0 || SnakeX > 14 || SnakeY <=0 || SnakeY > 14){
        return showGameOver()
    }
    
    //adding food and snake body into the board
    board.innerHTML = setHtml;
}

//when game is over
function showGameOver() {

    gameOverSound.play()

    //display game over text
    gameOverText.innerText = "Game Over..." 

    //setting up high score
    if (score > highsc){
        highsc = score 
        localStorage.setItem("HighScore",JSON.stringify(highsc))

        console.log(highsc)
    }

    
    //adding a function to reset the game
    playbtn.addEventListener("click",playAgain)

    playbtn.innerHTML = "playagain"+`<img src="controls/reset-icon.svg" alt="reset">`
    
    //Clearing interval to stop snake
    clearInterval(setIntervalID)

    document.removeEventListener("keydown",moveSnake)

    //Hidding keys
    document.getElementById("keys").style.display = "none"
    turnSound.pause()
    
    
}

//sound on and sound off functionality
function soundOff() {
    soundbtn.childNodes[1].src = "controls/sound-mute.svg"
    gameOverSound.muted = true
    eatSound.muted = true
    turnSound.muted = true


    soundbtn.removeEventListener("click",soundOff)
    soundbtn.addEventListener("click",soundOn)

}

function soundOn() {
    soundbtn.childNodes[1].src = "controls/sound.svg"
    gameOverSound.muted = false
    eatSound.muted = false
    turnSound.muted = false

    soundbtn.removeEventListener("click",soundOn)
    soundbtn.addEventListener("click",soundOff)
}

    soundbtn.addEventListener("click",soundOff)

FoodPosition() 
main()

//To move snaked automatically
setIntervalID = setInterval(main,200)

//adding event when key is pressed
document.addEventListener("keydown",moveSnake);
 
function play() {
    moveSnake({key:"ArrowRight"})
    console.log("playing")
    playbtn.removeEventListener("click",play)
}

playbtn.addEventListener("click",play)

//Reset function to restart
function playAgain() {
    location.reload();
}

