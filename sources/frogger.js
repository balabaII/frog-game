class Sprite{
    constructor(width, height, ix, iy, x){
        this.width = width;
        this.height = height;
        this.ix = ix;
        this.iy = iy;
        this.x = x;
    }
}

function Lane(direction, speed, sprites, y, isInRiver){
    this.direction = direction;
    this.speed = 10;
    this.sprites = sprites;
    this.y = y;
    this.isInRiver = isInRiver;
}


const carPurple1 = new Sprite(28, 20, 10, 267, 80),
    carPurple2 = new Sprite(28, 20, 10, 267, 186),
    carPurple3 = new Sprite(28, 20, 10, 267, 320),
    carPurple4 = new Sprite(28, 20, 10, 267, 230),
    carYellow1 = new Sprite(24, 26, 82, 264, 110),
    carYellow2 = new Sprite(24, 26, 82, 264, 290),
    carWhiteLong1 = new Sprite(46, 18, 106, 302, 51),
    carWhiteLong2 = new Sprite(46, 18, 106, 302, 148),
    carWhiteLong3 = new Sprite(46, 18, 106, 302, 245),
    carWhiteLong4 = new Sprite(46, 18, 106, 302, 342),
    carWhiteMedium1 = new Sprite(28, 24, 46, 265, 186),
    carWhiteShort1 = new Sprite(24, 21, 42, 301, 170),
    logLong1 = new Sprite(178, 22, 7, 165, 40),
    logLong2 = new Sprite(178, 22, 7, 165, 10),
    logLong3 = new Sprite(178, 22, 7, 165, 200),
    logMedium1 = new Sprite(117, 22, 7, 197, 20),
    logMedium2 = new Sprite(117, 22, 7, 197, 270),
    logMedium3 = new Sprite(117, 22, 7, 197, 20),
    logMedium4 = new Sprite(117, 22, 7, 197, 270),
    logShort1 = new Sprite(85, 22, 7, 230, 60),
    logShort2 = new Sprite(85, 22, 7, 230, 210),
    logShort3 = new Sprite(85, 22, 7, 230, 310),
    logShort4 = new Sprite(85, 22, 7, 230, 50),
    logShort5 = new Sprite(85, 22, 7, 230, 200),
    logShort6 = new Sprite(85, 22, 7, 230, 340),
    lane1 = new Lane(1, 30, [carPurple1, carPurple2, carPurple3], 470, false),
    lane2 = new Lane(-1, 30, [carWhiteMedium1], 440, false),
    lane3 = new Lane(1, 30, [carYellow1, carYellow2], 410, false),
    lane4 = new Lane(-1, 30, [carWhiteShort1], 380, false ),
    lane5 = new Lane(1, 30, [carWhiteLong1, carWhiteLong2, carWhiteLong3, carWhiteLong4], 350, false),
    lane6 = new Lane(-1, 30, [carPurple4], 320, false),
    lane7 = new Lane(1, 30, [logLong1], 260, true ),
    lane8 = new Lane(-1, 30, [logMedium1, logMedium2], 230, true ),
    lane9 = new Lane(1, 30, [logShort1, logShort2, logShort3], 200, true ),
    lane10 = new Lane(-1, 30, [logLong2, logLong3], 170, true ),
    lane11 = new Lane(1, 30, [logShort4, logShort5, logShort6], 140, true ),
    lane12 = new Lane(-1, 30, [logMedium3, logMedium4], 110, true ),
    lanes = [lane1, lane2, lane3, lane4, lane5, lane6, lane7, lane8, lane9, lane10, lane11, lane12];



const deadImg  = new Image(),
    sprites = new Image(),
    interfaceCtx = document.querySelector('#interfaceCanvas').getContext('2d'),
    spriteCtx = document.querySelector('#spriteCanvas').getContext('2d'),
    backgroundCtx = document.querySelector('#backgroundCanvas').getContext('2d'),
    frog = {
        x : 190,
        y : 500,
        direction : 'up',
        speed : 30,
        width: 23,
        height: 17
    },
    player = {
        time : 60, 
        lives : 5, 
        state : "start",
        score : 0,
        safeHomes : [ true, true, true, true ]
    };
    

let deaths = [], 
    completed = [],
    gameInterval, timeInterval;
    
    

deadImg.src = '../assets/dead.png';
sprites.src = '../assets/sprites.png';





function showStartScreen(){
    interfaceCtx.fillRect(0,0,400,565)
    interfaceCtx.drawImage(sprites, 0,0, 350, 50, 50, 180, 300, 50);
    interfaceCtx.fillStyle = 'green';
    interfaceCtx.fillRect(150, 250, 100, 50);
    interfaceCtx.font = '20px Arial'
    interfaceCtx.fillStyle = 'black';
    interfaceCtx.fillText("Start", 178, 280);
}



function startGame(event){
    const rect = event.target.getBoundingClientRect(),
        x = event.clientX -  rect.left,
        y = event.clientY - rect.top;

    if( player.state === 'start' && isPointCollision(x, y, 150, 250, 100, 50) ){

        player.state = 'playing';
        interfaceCtx.clearRect(0,0,400, 565);

        renderBackground();
        renderLives();
        renderScore();
        gameInterval = setInterval(() => {
            renderFrog(),
            renderSprites(),
            checkDeath();
        }, 50)
        timeInterval = setInterval(renderTime, 1000)
    }
};


function playAgain(event){
    const rect = event.target.getBoundingClientRect(),
        x = event.clientX -  rect.left,
        y = event.clientY - rect.top;
    if( player.state === 'end' && isPointCollision( x, y, 150, 270, 100, 40 )){
        player.state = 'start';
        putDefaultValues();
        showStartScreen();
    }
};

function putDefaultValues(){
    player.time = 60;
    player.lives = 5;
    player.score = 0;
    player.safeHomes = [true, true, true, true];

    frog.x = 190;
    frog.y = 500;

    deaths = [];
    completed = [];
}



function renderBackground(){
    backgroundCtx.fillStyle = 'black';
    backgroundCtx.fillRect(0,0, 400, 55);
    backgroundCtx.drawImage(sprites,
                            15, 12, 318, 32,
                            44, 12 , 318, 32);

    backgroundCtx.fillStyle = 'blue';
    backgroundCtx.fillRect(0, 60, 400, 230);
    backgroundCtx.drawImage(sprites,
                            0, 55, 399, 54, 
                            0, 55, 400, 54);
    // backgroundCtx.strokeRect(45, 55, 50, 54);
    // backgroundCtx.strokeRect(130, 55, 50, 54);
    // backgroundCtx.strokeRect(215, 55, 50, 54);
    // backgroundCtx.strokeRect(300, 55, 50, 54);

    backgroundCtx.drawImage(sprites, 
                            0, 114, 399, 39,
                            0, 280, 400, 40);
    backgroundCtx.fillStyle = 'black';
    backgroundCtx.fillRect(0, 309, 400, 185)

    backgroundCtx.drawImage(sprites, 
                            0, 115, 399, 39,
                            0, 490, 400, 40);
    backgroundCtx.fillRect(0, 525, 400, 45);

}


function renderFrog(){
    interfaceCtx.clearRect(0,0,400, 565);
    deaths.forEach( item =>{
        interfaceCtx.drawImage(deadImg, 5, 3, 23 ,17, item.x, item.y, 23, 17);
    });
    completed.forEach( item => {
        interfaceCtx.drawImage(sprites, 13, 368, 23, 17, item , 80, 23,17)
    });
    interfaceCtx.drawImage(sprites, 
                            13, 368, 23, 17,
                            frog.x, frog.y, frog.width, frog.height);
}


function renderLives(){
    backgroundCtx.clearRect(5,530, 70, 12);
    backgroundCtx.fillStyle = 'black';
    backgroundCtx.fillRect(5, 530, 70, 12);
    let distance = 5;
    for( let i = 0; i < player.lives; i++){
        backgroundCtx.drawImage(sprites,
                                13, 334, 17, 23,
                                distance, 530, 9, 12);
        distance += 15;
    }
}

function renderScore(){
    backgroundCtx.clearRect(5, 545, 80, 15)
    backgroundCtx.fillStyle = 'black';
    backgroundCtx.fillRect(5, 545, 80, 15)

    backgroundCtx.fillStyle = 'yellow';
    backgroundCtx.font = '15px Arial'
    backgroundCtx.fillText(`Score: ${player.score}`, 5, 560)
};

function renderTime(){
    if( player.time === 0) {
        gameOver();
        return
    }
    backgroundCtx.clearRect(300,540,80,20)
    backgroundCtx.fillStyle = 'black';
    backgroundCtx.fillRect(300,540,80,20)

    backgroundCtx.fillStyle = 'yellow';
    backgroundCtx.font = '20px Arial';
    backgroundCtx.fillText(`Time: ${player.time}`, 300, 555);

    player.time -= 1;
};

function renderSprites(){
    spriteCtx.clearRect(0,0, 400, 565);

    lanes.forEach( lane =>{
        lane.sprites.forEach( sprite =>{
            spriteCtx.drawImage(sprites, sprite.ix, sprite.iy, sprite.width, sprite.height,
                                    sprite.x, lane.y, sprite.width, sprite.height);
            if( lane.direction === 1){

                sprite.x = sprite.x - sprite.width >=400 ? 0 - sprite.width : sprite.x + lane.speed;     
            }else{
                sprite.x = sprite.x + sprite.width <= 0 ? 400 + sprite.width : sprite.x - lane.speed;
            };
                       
        })//spires for each
    })//lanes for each
};//renderSprites




function checkDeath(){
    const arr = [];
    lanes.forEach( lane => {
        if( lane.y  === frog.y){
            lane.sprites.forEach( sprite =>{
                if( lane.isInRiver){
                    arr.push( riverDeathCheck(sprite, lane) );
                    
                }else{
                    roadDeathCheck(sprite, lane);
                }
            });

            if( arr.some( item => !!item) && lane.isInRiver){
                if( lane.direction === 1){
                    frog.x += frog.x >= 377 ? 0 : lane.speed;
                }else{
                    frog.x += frog.x === 0 ? 0 : -lane.speed;
                }
            }else if(!arr.some( item => !!item) && lane.isInRiver ){
                frogDies()
            }
        }
    })
}

function roadDeathCheck(sprite, lane){
    if( isBoxCollision( sprite.x, lane.y, sprite.width, sprite.height, frog.x, frog.y, frog.width, frog.height) ) frogDies();
}
function riverDeathCheck(sprite, lane){
    if( isBoxCollision( sprite.x, lane.y, sprite.width, sprite.height, frog.x, frog.y, frog.width, frog.height) ) {
        return true;
    }else{
        return false;
    }
}

function frogDies(){
    if( player.lives === 0){
        gameOver();
        return
    }
    deaths.push( { x : frog.x , y : frog.y } )
    frog.x = 190;
    frog.y = 500;
    interfaceCtx.drawImage(sprites, 
                            13, 368, 23, 17,
                            frog.x, frog.y, frog.width, frog.height);
    player.lives -= 1;
    renderLives();
}



function gameOver(){
    player.state = 'end';
    clearInterval( gameInterval );
    clearInterval( timeInterval );
    backgroundCtx.clearRect(0, 0, 400, 565);
    interfaceCtx.clearRect(0,0, 400, 565);
    spriteCtx.clearRect(0, 0, 400, 565);

    interfaceCtx.fillStyle = 'black';
    interfaceCtx.fillRect(0,0,400,565);

    interfaceCtx.font = '30px Arial';
    interfaceCtx.fillStyle = 'Yellow';
    interfaceCtx.fillText("Game Over", 120, 200);
    interfaceCtx.fillText(`Score: ${player.score}`, 120, 250);


    interfaceCtx.fillStyle = 'green';
    interfaceCtx.fillRect(150, 270, 100, 40);

    interfaceCtx.fillStyle = 'black';
    interfaceCtx.font = '15px Arial';
    interfaceCtx.fillText('Play Again', 165, 295 )
}





function frogUp(){
    let index;
    if( frog.y === 110){
        let b1x = 45;
        for( let i = 0 ; i < 4; i++){
            if( isBoxCollision(b1x, 55, 50, 54, frog.x, 80, frog.width, frog.height) ) {
                index = i;
                if( !player.safeHomes[i] ) break;

                player.safeHomes[i] = false;
                player.score += 100;
                if ( !player.safeHomes.some( item => item) ) gameOver();
                completed.push( frog.x );
                
                player.lives -= 1;
                frog.x = 190;
                frog.y = 500;
                renderScore();
                renderLives();
                break;
            }else{
                frogDies();
            }
            b1x += 85;
        };
    };
    let moveUp = frog.y - frog.speed <= 50  ? 0 : -frog.speed
    if( index !== undefined ) moveUp = player.safeHomes[index] ? moveUp : 0;
    frog.y += moveUp;
}


function moveFrog(event){
    switch(event.code){
        case "ArrowUp":
            frogUp();
            break;

        case "ArrowRight":
            frog.x += frog.x + frog.speed >= 400 ? 0 : frog.speed;
            break;

        case "ArrowDown":
            frog.y += frog.y + frog.speed > 500 ? 0 : frog.speed;
            break;

        case "ArrowLeft":
            frog.x += frog.x - frog.speed <= 0 ? 0 : -frog.speed;
            break;
    }

}





function isPointCollision(px, py, bx, by, bw, bh){
    let counter = 0;
    if( px >= bx && px <= bx + bw ) counter += 1;
    if( py >= by && py <= by + bh ) counter += 1;
    return counter === 2;
}

function isBoxCollision(b1x, b1y, b1w, b1h, b2x, b2y, b2w, b2h){
    let vx = (b1x * 2 + b1w) / 2 - (b2x * 2 + b2w) / 2 ,
        vy =(b1y * 2 + b1h) / 2 - (b2y * 2 + b2h) / 2 , 
        combinedHalfWidth = b1w/2 + b2w/2,
        combinedHalfHeight = b1h / 2 + b2h/ 2;
    if ( vx < 0 ) vx *= -1;
    if ( vy < 0 ) vy *= -1; 

    return vx < combinedHalfWidth && vy < combinedHalfHeight;
}






window.addEventListener('load' , showStartScreen);
document.addEventListener('keydown', moveFrog)
document.querySelector('#interfaceCanvas').addEventListener('click', startGame);
document.querySelector('#interfaceCanvas').addEventListener('click', playAgain);




