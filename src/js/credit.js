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
    this.load.image('kitchen', 'assets/kitchen_credit.png');
}

function create ()
{
    //  A simple background for our game
    this.add.image(WIDTH/2, HEIGHT/2, 'kitchen');

    textConfig =  {font: '40pt Roboto', fill: '#000'}

    this.add.text(WIDTH/2, 100, 'Credits', textConfig).setOrigin(0.5, 0.5);

    this.add.text(WIDTH/2, 200, "Code: Thorsten Mehlich, Karl Welzel and Sachin Shetty",
    {
        font: '20pt Roboto',
        fill: '#000',
        wordWrap: {
            width: 1000,
            callback: null,
            callbackScope: null,
            useAdvancedWrap: false
        }
    }).setOrigin(0.5, 0.5);

    var creditText = "Assets: \n";
    creditText += "Buttons: https://opengameart.org/content/ui-pack \n";
    creditText += "Kitchen: https://www.shutterstock.com/image-illustration/cartoon-interior-family-kitchen-counter-appliances-1224326065 \n";
    creditText += "Cake: https://commons.wikimedia.org/wiki/File:Cartoon_Happy_Birthday_Cake.svg \n";
    creditText += "Food: https://henrysoftware.itch.io/pixel-food \n";
    creditText += "Dog: https://opengameart.org/content/rusty \n";
    creditText += "Barking image: https://en.wikipedia.org/wiki/File:Icon_sound_loudspeaker.svg \n";
    creditText += "Barking sound: https://www.zapsplat.com/music/dog-barking-3/ \n";
    creditText += "Cat: https://opengameart.org/content/cat-sprites \n";

    this.add.text(WIDTH/2, 350, creditText,
    {
        font: '9pt Roboto',
        fill: '#000',
        wordWrap: {
            width: 1000,
            callback: null,
            callbackScope: null,
            useAdvancedWrap: false
        }
    }).setOrigin(0.5, 0.5);

}

function update ()
{

}
