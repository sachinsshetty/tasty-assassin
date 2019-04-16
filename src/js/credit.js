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

    var creditText = "Code: Thorsten Mehlich, Karl Welzel ans Sachin Shetty \n"
    creditText += "Assets: \n\nhttps://opengameart.org/content/rusty \n"
    creditText += "https://commons.wikimedia.org/wiki/File:Cartoon_Happy_Birthday_Cake.svg "
    creditText += "https://henrysoftware.itch.io/pixel-food \n"
    creditText += "https://en.wikipedia.org/wiki/File:Icon_sound_loudspeaker.svg \n"
    creditText += "https://www.zapsplat.com/music/dog-barking-3/ \n"
    creditText += "https://opengameart.org/content/ui-pack"

    this.add.text(WIDTH/2, 350, , creditText
    {
		font: '20pt Roboto',
		fill: '#000',
		wordWrap: {
			width: 800,
			callback: null,
			callbackScope: null,
			useAdvancedWrap: false
		}
	}).setOrigin(0.5, 0.5);

}

function update ()
{

}
