var WIDTH = 986;
var HEIGHT = 600;

var config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload ()
{
    // Background
    this.load.image('kitchen', 'src/assets/kitchen_credit.png');

    // Buttons
    this.load.image('button', 'src/assets/buttons/green_button00.png');
    this.load.image('buttonPressed', 'src/assets/buttons/green_button01.png');
}

function create ()
{
    //  A simple background for our game
    this.add.image(WIDTH/2, HEIGHT/2, 'kitchen');

    this.add.text(WIDTH/2, 100, "Don't Eat (Me)", {
        font: '40pt Roboto', fill: '#000'
    }).setOrigin(0.5, 0.5);

    textConfig =  {font: '20pt Roboto', fill: '#000'}

    startButton = this.add.image(493, 240, 'button')
                          .setInteractive()
                          .setData('isPressed', false);
    this.add.text(WIDTH/2, 235, 'Easy', textConfig)
            .setOrigin(0.5, 0.5);

    startButton.on('pointerdown', function () {
        startButton.setData('isPressed', true);
        startButton.setTexture('buttonPressed');
    });

    startButton.on('pointerout', function () {
        startButton.setTexture('button');
    });

    startButton.on('pointerover', function () {
        if (startButton.getData('isPressed')) {
            startButton.setTexture('buttonPressed');
        }
    });

    startButton2 = this.add.image(WIDTH/2, HEIGHT/2, 'button')
                          .setInteractive()
                          .setData('isPressed', false);
    this.add.text(WIDTH/2, 295, 'Hard', textConfig)
            .setOrigin(0.5, 0.5);

    startButton2.on('pointerdown', function () {
        startButton2.setData('isPressed', true);
        startButton2.setTexture('buttonPressed');
    });

    startButton2.on('pointerout', function () {
        startButton2.setTexture('button');
    });

    startButton2.on('pointerover', function () {
        if (startButton2.getData('isPressed')) {
            startButton2.setTexture('buttonPressed');
        }
    });

    creditsButton = this.add.image(WIDTH/2, 360, 'button')
                            .setInteractive()
                            .setData('isPressed', false);
    this.add.text(WIDTH/2, 355, 'Credits', textConfig)
            .setOrigin(0.5, 0.5);

    creditsButton.on('pointerdown', function () {
        creditsButton.setData('isPressed', true);
        creditsButton.setTexture('buttonPressed');
    });

    creditsButton.on('pointerout', function () {
        creditsButton.setTexture('button');
    });

    creditsButton.on('pointerover', function () {
        if (creditsButton.getData('isPressed')) {
            creditsButton.setTexture('buttonPressed');
        }
    });

    this.input.on('pointerup', function () {
        if (startButton.getData('isPressed')) {
            startButton.setData('isPressed', false);
            startButton.setTexture('button');
            location.href = 'src/level1.html';
        }
        if (startButton2.getData('isPressed')) {
            startButton2.setData('isPressed', false);
            startButton2.setTexture('button');
            location.href = 'src/level2.html';
        }
        if (creditsButton.getData('isPressed')) {
            creditsButton.setData('isPressed', false);
            creditsButton.setTexture('button');
            location.href = 'src/credits.html';
        }
    })

}

function update ()
{

}
