const canvas = document.querySelector('canvas')
const mainBackgroundMusic = document.getElementById('mainBackgroundMusic');
const quizBackgroundMusic = document.getElementById('quizBackgroundMusic');
const correctAnswerSound = document.getElementById('correctAnswerSound');
const jumpSound = document.getElementById('jumpSound');
const c = canvas.getContext('2d')
canvas.width = 1024
canvas.height = 576

let scrollOffset = 0 
let gamePaused = false;
let quizShown = false;


const quizzes = [
    {
        question: 'What is the official colour of University of Cambridge that was registered in Pantone?',
        options: ['Red', 'Purple', 'Spring Green'],
        correctAnswer: 'c',
        triggerScrollOffset: 610
    },
    {
        question: 'You can directly apply to the University of Cambridge with an Indonesian qualification',
        options: ['True', 'False', "Not Given"],
        correctAnswer: 'b',
        triggerScrollOffset: 1600
    },
    {
        question: 'How many colleges are there in Cambridge?',
        options: ['31', '32', '33'],
        correctAnswer: 'a',
        triggerScrollOffset: 5160
    },
    {
        question: 'Which Cambridge course has the most expensive tuition fees?',
        options: ['Engineering', 'Business', 'Veterinary Science'],
        correctAnswer: 'c',
        triggerScrollOffset: 7910
    },
    {
        question: 'The following scholarships below are supporting your education in Cambridge, except:',
        options: ['LPDP', 'Beasiswa Indonesia Maju', 'Jardine Foundation'],
        correctAnswer: 'b',
        triggerScrollOffset: 8900
    },
    {
        question: 'Undergraduate students are expected to work part-time.',
        options: ['Yes', 'No', 'Not Given'],
        correctAnswer: 'b',
        triggerScrollOffset: 9500
    },
    {
        question: 'These are what colleges meant to be, except:',
        options: ['Lecture', 'Accommodation', 'Entertaiment'],
        correctAnswer: 'a',
        triggerScrollOffset: 12180
    },
    // Add more quizzes as needed with different triggerScrollOffset values
];   
let currentQuizIndex = 0;
let currentQuizQuestion = '';
let currentQuizOptions = [];

function showQuizUI() {
    pauseMainBackgroundMusic();  // Pause main background music
    playQuizBackgroundMusic();

    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('quiz-question').textContent = currentQuizQuestion;

    currentQuizOptions.forEach((option, index) => {
        document.getElementById(`quiz-options-${String.fromCharCode(97 + index)}`).textContent = option;
    });
}

function hideQuizUI() {
    pauseQuizBackgroundMusic();
    playMainBackgroundMusic();
    document.getElementById('quiz-container').style.display = 'none';
}

window.checkAnswer = function(userAnswer) {
    const correctAnswer = quizzes[currentQuizIndex].correctAnswer;

    if (userAnswer === correctAnswer) {
        console.log('Correct! Continue the game.');
        currentQuizIndex++;
        playCorrectAnswerSound();
    } else {
        console.log('Wrong answer! Game over.');
        currentQuizIndex = 0;
        window.location.href = 'gameover.html'
    }

    hideQuizUI();
    gamePaused = false;
};

function setQuizData() {
    currentQuizQuestion = quizzes[currentQuizIndex].question;
    currentQuizOptions = quizzes[currentQuizIndex].options;
}

function createImage(imageSrc) {
    const image = new Image()
    image.src = imageSrc
    return image
}

function playMainBackgroundMusic() {
    mainBackgroundMusic.play();
}

function pauseQuizBackgroundMusic() {
    quizBackgroundMusic.pause();
    quizBackgroundMusic.currentTime = 0;
}

function pauseMainBackgroundMusic() {
    mainBackgroundMusic.pause();
}

function playQuizBackgroundMusic() {
    quizBackgroundMusic.play();
}

function playCorrectAnswerSound() {
    correctAnswerSound.play();
}

function playJumpSound() {
    jumpSound.currentTime = 0;
    jumpSound.play();
}

function initAudio() {
    const audioElements = [mainBackgroundMusic, quizBackgroundMusic, correctAnswerSound];
    let loadedCount = 0;

    function checkAllLoaded() {
        loadedCount++;
        if (loadedCount === audioElements.length) {
            // All audio files are loaded, play the main background music
            playMainBackgroundMusic();
        }
    }

    audioElements.forEach(audioElement => {
        audioElement.addEventListener('loadeddata', checkAllLoaded);
        audioElement.load();
    });
}
initAudio()
const gravity = 0.5
class Player {
    constructor() {
        this.onPlatform = true
        this.speed = 10
        this.position = {
            x: 100,
            y: 100
        }
        this.velocity = {
            x: 0, 
            y: 1
        }
        this.width = 66
        this.height = 150
        this.image = createImage('./img/spriteStandRight.png')
        this.frames = 0
        this.sprites = {
            stand : {
                right : createImage('./img/spriteStandRight.png'),
                left : createImage('./img/spriteStandLeft.png'),
                cropWidth : 177,
                width: 66
            },
            run : {
                right :createImage('./img/spriteRunRight.png'),
                left :createImage('./img/spriteRunLeft.png'),
                cropWidth : 341,
                width: 127.875
            }
        }
        this.currentSprite = this.sprites.stand.right
        this.currentCropWidth = 177
    }
    
    draw() {
        c.drawImage(
            this.currentSprite,
            this.currentCropWidth * this.frames,
            0,
            this.currentCropWidth,
            400,
            this.position.x, 
            this.position.y,
            this.width,
            this.height)
    }

    update() {
        this.frames++
        if(this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)) this.frames = 0
        else if (this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)) this.frames = 0
        this.velocity.y !== 0 ? this.onPlatform = false : this.onPlatform = true
        this.draw() 
        this.position.y += this.velocity.y
        this.position.x += this.velocity.x
        if(this.position.y + this.height + this.velocity.y <= canvas.height)
            this.velocity.y += gravity
    }
}

class Platform {
    constructor({x, y, image}) {
        this.position = {
            x: x,
            y: y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

class GenericObject {
    constructor({x, y, image}) {
        this.position = {
            x: x,
            y: y
        }
        this.image = image
        this.width = image.width
        this.height = image.height
    
    }

    draw() {
        c.drawImage(this.image, this.position.x, this.position.y)
    }
}

let platformImage = createImage('./img/platform.png')
let platformSmallTallImage = createImage('./img/platformSmallTall.png')

let player = new Player()
let platforms = []
let lastKey

let genericObjects = []

const keys = {
    right: {
        pressed: false
    },
    left: {
        pressed: false
    },
    

}


function init() {
    quizShown = false;
    gamePaused = false;
    platformImage = createImage('./img/platform.png')
    platformSmallTallImage = createImage('./img/platformSmallTall.png')
    currentQuizIndex = 0;
    currentQuizQuestion = '';
    currentQuizOptions = [];
    player = new Player()
    platforms = [
        new Platform({x: platformImage.width * 4 + 500-2 + platformImage.width - platformSmallTallImage.width, y: 270, image : platformSmallTallImage}),
        new Platform({x: platformImage.width * 10 + 1050 + platformImage.width - platformSmallTallImage.width, y: 270, image : platformSmallTallImage}),
        new Platform({x: -1, y: 470, image : platformImage}),
        new Platform({x: platformImage.width-3, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 2 + 100, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 3 + 500, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 4 + 500-2, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 6 + 640, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 7 + 1050, y: 280, image : platformImage}),
        new Platform({x: platformImage.width * 8 + 1050-2, y: 280, image : platformImage}),
        new Platform({x: platformImage.width * 10 + 1050, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 12 + 900, y: 100, image : platformImage}),
        new Platform({x: platformImage.width * 14 + 1050, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 15 + 1050-2, y: 470-2-platformImage.height, image : platformImage}),
        new Platform({x: platformImage.width * 16 + 1050-2, y: 470-2-platformImage.height*2, image : platformImage}),
        new Platform({x: platformImage.width * 17 + 1050-2, y: 470-2-platformImage.height*3, image : platformImage}),
        new Platform({x: platformImage.width * 19 + 1300, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 20 + 1300-2, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 21 + 1300-2, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 22 + 1300-2, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 23 + 1300-2, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 24 + 1300-2, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 25 + 1300-2, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 26 + 1300-2, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 27 + 1300-2, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 28 + 1300-2, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 29 + 1300-2, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 30 + 1300-2, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 31 + 1300-2, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 32 + 1300-2, y: 470, image : platformImage}),
        new Platform({x: platformImage.width * 33 + 1300-2, y: 470, image : platformImage}),


    ]

    genericObjects = [
        new GenericObject({
            x: -1,
            y: -1,
            image: createImage('./img/background.png')
        }),

        new GenericObject({
            x: -1,
            y: -1,
            image: createImage('./img/hill.png')
        })
    ]

    scrollOffset = 0 

}

function animate() {
    requestAnimationFrame(animate)
    if (gamePaused) {
        // If the game is paused, do not update the game logic
        return;
    }
    c.fillStyle = 'white'
    c.fillRect(0, 0, canvas.width, canvas.height)

    genericObjects.forEach(genericObject => {
        genericObject.draw()
    })

    platforms.forEach(platform => {
        platform.draw()
    })
    player.update()
    const triggerOffsets = quizzes.map(quiz => quiz.triggerScrollOffset);
    if (!quizShown) {
        const currentQuiz = quizzes.find(quiz => scrollOffset === quiz.triggerScrollOffset);

        if (currentQuiz) {
            setQuizData();
            showQuizUI();
            quizShown = true;
            gamePaused = true;
        }
    }

    if(keys.right.pressed && player.position.x < 400) {
        player.velocity.x = player.speed
    } else if ((keys.left.pressed && player.position.x > 100) || (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)){
        player.velocity.x = -player.speed
    } else {
        player.velocity.x = 0

        if(keys.right.pressed) {
            scrollOffset += player.speed
            platforms.forEach(platform => {
                platform.position.x -= player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x -= player.speed * 0.66
            })
        } else if (keys.left.pressed && scrollOffset > 0) {
            scrollOffset -= player.speed
            platforms.forEach(platform => {
                platform.position.x += player.speed
            })
            genericObjects.forEach(genericObject => {
                genericObject.position.x += player.speed * 0.66
            })
        }
    }
    console.log(scrollOffset)
    //Platform Detector
    platforms.forEach(platform => {
        if(player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) {
            player.velocity.y = 0
        }
    })

    //Sprite Switching
    if(keys.right.pressed && lastKey === "right" &&  player.currentSprite !== player.sprites.run.right) {
        player.frames = 1
        player.currentSprite = player.sprites.run.right
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    } else if (keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.left) {
        player.currentSprite = player.sprites.run.left
        player.currentCropWidth = player.sprites.run.cropWidth
        player.width = player.sprites.run.width
    } else if (!keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.stand.left) {
        player.currentSprite = player.sprites.stand.left
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    } else if (!keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.stand.right) {
        player.currentSprite = player.sprites.stand.right
        player.currentCropWidth = player.sprites.stand.cropWidth
        player.width = player.sprites.stand.width
    }

    //Menang
    if(scrollOffset > 12600) {
        window.location.href = 'menang.html'
    }

    //Kalah
    if(player.position.y > canvas.height) {
        console.log('Kalah!')
        window.location.href = 'gameover.html'

    }
    if (scrollOffset % 100 !== 0) {
        quizShown = false;
    }
}
init()
animate()

addEventListener('keydown', ({ keyCode }) => {
    switch(keyCode) {
        case 65 :
            console.log('kiri')
            keys.left.pressed = true
            lastKey = "left"
            break
        case 83 :
            console.log('bawah')
            break
        case 68 :
            console.log('kanan')
            keys.right.pressed = true
            lastKey = "right"
            break
        case 87 :
            console.log('atas')
            if(event.repeat) {return}
            if(player.onPlatform === true) {
            player.velocity.y -= 14
            playJumpSound()
            } else {null}
            break
    }
}) 

addEventListener('keyup', ({ keyCode }) => {
    switch(keyCode) {
        case 65 :
            console.log('kiri')
            keys.left.pressed = false
            break
        case 83 :
            console.log('bawah')
            break
        case 68 :
            console.log('kanan')
            keys.right.pressed = false
            break
        case 87 :
            console.log('atas')
            break
    }
}) 