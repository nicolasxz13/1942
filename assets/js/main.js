var player = {
    left: 450,
    top: 620
};
//12 enemies max left. Example
/*
var enemies = [
    { enemytype: 0, left: 0, top: 0 },
    { enemytype: 1, left: 75, top: 0 },
    { enemytype: 1, left: 150, top: 0 },
    { enemytype: 1, left: 225, top: 0 },
    { enemytype: 1, left: 300, top: 0 },
    { enemytype: 0, left: 375, top: 0 },
    { enemytype: 1, left: 450, top: 0 },
    { enemytype: 1, left: 525, top: 0 },
    { enemytype: 0, left: 600, top: 0 },
    { enemytype: 1, left: 675, top: 0 },
    { enemytype: 0, left: 750, top: 0 },
    { enemytype: 1, left: 825, top: 0 },
];
*/
var enemies = [];

var display = 1000;
var missiles = []
var gamerun = false;

function getrandomminmax(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function spawnship() {
    if (enemies.length === 0) {
        let temp_left = getrandomminmax(1, 12) * 75;
        let enemiestype = getrandomminmax(0, 1);
        enemies.push({ enemytype: enemiestype, left: temp_left, top: 0 });
    } else if (enemies.length < 7) {
        var temp_left = getrandomminmax(1, 12) * 70;
        let enemiestype = getrandomminmax(0, 1);
        console.log("temp" + temp_left);
        if(temp_left < 825){
            enemies.push({ enemytype: enemiestype, left: temp_left, top: 0 });
        }
    }
}



function updateDisplay() {
    document.getElementById('display').innerHTML = display;
}

function drawPlayer() {
    var content = `<div class='player' style='left: ${player.left}px; top: ${player.top}px;'></div>`;
    document.getElementById('players').innerHTML = content;
};

function drawEnemies() {
    var content = '';
    console.log(enemies);
    for (var i = 0; i < enemies.length; i++) {
        content += `<div class='enemy${enemies[i].enemytype}' style='left:${enemies[i].left}px; top:${enemies[i].top}px;'></div>`;
    }
    document.getElementById('enemies').innerHTML = content;
};
function drawMissiles() {
    var content = '';
    console.log(missiles);
    for (var i = 0; i < missiles.length; i++) {
        content += `<div class='missile' style='left:${missiles[i].left}px; top:${missiles[i].top}px;'></div>`;
    }
    document.getElementById('missiles').innerHTML = content;
};

function moveEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        enemies[i].top = enemies[i].top + 10;
    }
};

function moveMissiles() {
    for (var i = 0; i < missiles.length; i++) {
        missiles[i].top = missiles[i].top - 10;
    }
}

function validEnemiesLocation() {
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].top > 620) {
            enemies[i].top = 0;
        }
    }
}

function validMissiles() {
    for (var i = 0; i < missiles.length; i++) {
        if (missiles[i].top < 13) {
            missiles.splice(i, 1);
        }
    }
}

function drawexplosion(top, left) {
    document.getElementById('explosions').insertAdjacentHTML('beforeend', `<div class='explosion' id='explosion_top_${top}_left_${left}' style='left:${left}px;top:${top}px;' ></div>`);
    document.getElementById(`explosion_top_${top}_left_${left}`).addEventListener("animationend", (evento) => {
        evento.target.remove();
    });
}

function hitenemiesbyship() {
    for (var indx = 0; indx < enemies.length; indx++) {
        if (Math.abs(enemies[indx].top - player.top) < 75 && Math.abs(enemies[indx].left - player.left) < 70) {
            console.log("Boom!");
            drawexplosion(player.top, player.left);
            enemies.splice(indx, 1);
            playBoom();
            display = display - 500;
            break;
        }
    }
}

function hitenemiesbymissile() {
    for (var i = 0; i < missiles.length; i++) {
        for (var indx = 0; indx < enemies.length; indx++) {
            if (Math.abs(enemies[indx].top - missiles[i].top) < 75 && Math.abs(enemies[indx].left - missiles[i].left) < 40) {
                console.log("Boom!");
                drawexplosion(enemies[indx].top, enemies[indx].left);
                enemies.splice(indx, 1);
                missiles.splice(i, 1);
                playBoom();
                display = display + 10;
                break;
            }
        }
    }
}

function playBoom() {
    const miAudio = document.getElementById('impact');
    miAudio.play();
}

//document

document.onkeydown = function (e) {
    //game start ?
    if (gamerun) {
        if (e.key == 'ArrowLeft' && player.left > 0) { // LEFT
            player.left = player.left - 10;
        }
        if (e.key == 'ArrowUp' && player.top >= 400) {// UP
            player.top = player.top - 10;
        }
        if (e.key == 'ArrowRight' && player.left < 830) { // RIGHT
            player.left = player.left + 10;
        }
        if (e.key == 'ArrowDown' && player.top < 620) { // DOWN
            player.top = player.top + 10;
        }
        if (e.key == ' ') {
            missiles.push({ left: (player.left + 33), top: (player.top - 8) })
            drawMissiles();
        }
        drawPlayer();
    }
};

function gameloop() {
    if (!gamerun) {
        return;
    }
    console.log('Game is running');

    drawPlayer();

    moveMissiles();
    validMissiles();
    hitenemiesbymissile();
    drawMissiles();

    hitenemiesbyship();
    moveEnemies();
    validEnemiesLocation();
    spawnship();
    drawEnemies();


    updateDisplay();
    setTimeout(gameloop, 50);
};

function soundloop() {
    var sound = document.getElementById('suspense');
    sound.loop = true;
    sound.play();
}

function start() {
    if (!gamerun) {
        gamerun = true;
        gameloop();
        soundloop();

    }
};
