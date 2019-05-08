
var WIDTH = 986;
var HEIGHT = 600;

var GRAVITY = 500;
var TIME_MULTIPLIER = 1000;

var LEVEL_TIME = 1*60; // in seconds , 4*60; // in seconds
var THROW_SPEED = 300;
var FRIDGE_COOLDOWN = 5;
var BARKING_COOLDOWN = 3; // in seconds, 0.2; // in seconds
var BARK_SPEED = 200; // 400;
var SLEEPING_TIME = 1; // in seconds
var KITTEN_SPEED = 500;
var CAKE_SPEED = 160;

var config = {
    type: Phaser.AUTO,
    width: WIDTH,
    height: HEIGHT,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: GRAVITY },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var background;
var platforms;
var fridge;
var walls;
var bottoms;
var cake;
var appleProjectiles;
var dogs;
var barks;
var barkingSound;
var kittens;
var miauSound;
var crazyCat1Sound;
var crazyCat2Sound;

var cherries = [];
var apples = [];

// numberOfCherries + numberOfApples needs to be less than 20
var numberOfCherries = 10;
var numberOfApples = 0;
var timeText;
var numberOfApplesInFridge = 0;

var gameWonEvent;
var gameOver = false;

var cursors;
var keySpace;

var game = new Phaser.Game(config);

function preload ()
{
	// Background
    this.load.image('kitchen', 'assets/kitchen.png');

    // Platforms and boundaries
    this.load.image('ground', 'assets/platform.png');
    this.load.image('bottom', 'assets/bottom.png');
    this.load.image('wall', 'assets/wall.png');


	// Player
    this.load.spritesheet('cake', 'assets/cake-sprite.png', { frameWidth: 100, frameHeight: 100 });

    // Food assets
    this.load.image('apple', 'assets/food/Apple.png');
    this.load.image('cherry', 'assets/food/Cherry.png');
    this.load.image('fish', 'assets/food/Fish.png');
    this.load.image('peach', 'assets/food/Peach.png');
    this.load.image('strawberry', 'assets/food/Strawberry.png');
    this.load.image('tomato', 'assets/food/Tomato.png');

    // Dog assets
    this.load.image('dog', 'assets/pets/dog.png');
    this.load.image('barking', 'assets/projectiles/barking.png');
    this.load.audio('barkingSound', 'assets/pets/barking_sound.mp3');
    this.load.audio('miauSound', 'assets/pets/miau_sound.wav');
    this.load.audio('crazyCat1Sound', 'assets/pets/crazyCat1_sound.wav');
    this.load.audio('crazyCat2Sound', 'assets/pets/crazyCat2_sound.wav');

    // Cat assets
    this.load.spritesheet('cat', 'assets/pets/cat-sprite.png', { frameWidth: 64, frameHeight: 64 });

}

function create ()
{
	//  Our player animations, turning, walking left and walking right.
	this.anims.create({
		key: 'left',
		frames: this.anims.generateFrameNumbers('cake', { start: 0, end: 3 }),
		frameRate: 10,
		repeat: -1
	});

	this.anims.create({
		key: 'turn',
		frames: [ { key: 'cake', frame: 4 } ],
		frameRate: 20
	});

	this.anims.create({
		key: 'right',
		frames: this.anims.generateFrameNumbers('cake', { start: 5, end: 8 }),
		frameRate: 10,
		repeat: -1
	});

	  // animations for kittens
	this.anims.create({
		key: 'leftCatWalk',
		frames: this.anims.generateFrameNumbers('cat', { start: 0, end: 5 }),
		frameRate: 10,
		repeat: -1
	});

	this.anims.create({
		key: 'rightCatWalk',
		frames: this.anims.generateFrameNumbers('cat', { start: 7, end: 12 }),
		frameRate: 10,
		repeat: -1
	});

    //  A simple background for our game
    background = this.add.image(WIDTH/2, HEIGHT/2, 'kitchen').setInteractive();
    //  Register a click anywhere on the screen
    background.on('pointerdown', onPointerDown);

    //  The platforms group contains the platforms for the cake
    platforms = this.physics.add.staticGroup();
    //  The walls are the world boundaries on the left and on the right
    walls = this.physics.add.staticGroup();
    //  The bottoms group contains the floor that cats and dogs can walk on
    bottoms = this.physics.add.staticGroup();

    fridgeWalls = this.physics.add.staticGroup();
    fridge = fridgeWalls.create(765, HEIGHT/2, 'wall').setVisible(false);
    // The apple images at the fridge
    fridge.setData('apples', [this.add.image(800, (HEIGHT/2) - 20, 'apple'),
                              this.add.image(824, (HEIGHT/2) - 20, 'apple'),
                              this.add.image(848, (HEIGHT/2) - 20, 'apple')]);
    fridge.setData('appleTimer', this.time.addEvent({
		delay: FRIDGE_COOLDOWN*TIME_MULTIPLIER,
		callbackScope: this,
		loop: true,
		callback: function () {
			if (numberOfApplesInFridge < 3) {
				numberOfApplesInFridge++;
			}
	    },
		}));


    platforms.create(100, 334, 'ground').setVisible(false);
    platforms.create(500, 334, 'ground').setVisible(false);

    //  Here we create the ground.
    bottoms.create(493, 616, 'bottom').setVisible(false);

    //  Here we create walls to the right and to the left of the screen
    walls.create(-16, HEIGHT/2, 'wall').setVisible(false);
    walls.create(WIDTH+16, HEIGHT/2, 'wall').setVisible(false);


    // The player and its settings
    cake = this.physics.add.sprite(200, 50, 'cake');
    //  Player physics properties. Give the little guy no bounce.
    cake.setBounce(0);
    cake.setCollideWorldBounds(true);

    appleProjectiles = this.physics.add.group({ collideWorldBounds: true });

    // The dogs - currently only one
    dogs = this.physics.add.group();
    dog = dogs.create(100, 536, 'dog');
    dog.setData('barkingTimer', this.time.addEvent({
		delay: BARKING_COOLDOWN*TIME_MULTIPLIER,
		callbackScope: this,
		loop: true,
		callback: function () {
			bark(dog);
	    },
		}));


    dog.setData('sleepingTimer', this.time.addEvent({
		delay: SLEEPING_TIME*TIME_MULTIPLIER,
		callbackScope: this,
		loop: true,
		paused: true,
		callback: function () {
			// The dog does not sleep any longer, so it starts to bark
			dog.getData('sleepingTimer').paused = true;
			dog.getData('barkingTimer').paused = false;
		}
		}));

    barks = this.physics.add.group({ allowGravity: false })
    barkingSound = this.sound.add('barkingSound');
    miauSound = this.sound.add('miauSound');
    crazyCat1Sound = this.sound.add('crazyCat1Sound');
    crazyCat2Sound = this.sound.add('crazyCat2Sound');

	// The kittens - also just one
    kittens = this.physics.add.group({ allowGravity: true });
    kitty = kittens.create(955, 536, 'cat')
                   .setVelocityX(-KITTEN_SPEED);
    kitty.setData('velocityX', -KITTEN_SPEED);
    kitty.setData('wallHits', 0);
    kitty.setData('wallHitsJump', 3);
    kitty.setData('hungry', true);
    kitty.anims.play('leftCatWalk', true);


    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    keySpace = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


    //  cherries contains 20 cherries and apples 20 apples that can be
    //  set visible or invisible later
    for (var i = 0; i < 20; i++) {
		cherries.push(this.add.image(16+24*i, 16, 'cherry'));
		apples.push(this.add.image(16+24*i, 16, 'apple'));
	}
	for (cherry of cherries) {
		cherry.setVisible(false);
	}
	for (apple of apples) {
		apple.setVisible(false);
	}


    //  Collide
    this.physics.add.collider(cake, platforms);
    this.physics.add.collider(cake, fridgeWalls, cakeHitFridge, null, this);
    this.physics.add.collider(appleProjectiles, bottoms);
    this.physics.add.collider(appleProjectiles, walls);
    this.physics.add.collider(appleProjectiles, appleProjectiles);
    this.physics.add.collider(dogs, bottoms);
    this.physics.add.collider(kittens, bottoms);
    this.physics.add.collider(kittens, walls, kittyHitWall, null, this);
    this.physics.add.overlap(kittens, dogs, kittyHitDog, null, this);

    this.physics.add.overlap(appleProjectiles, dogs, onAppleHitDog, null, this);
    this.physics.add.overlap(appleProjectiles, kittens, onAppleHitKitten, null, this);
    this.physics.add.overlap(cake, barks, onBarkHit, null, this);
    this.physics.add.overlap(cake, kittens, onkittensHit, null, this);

	// The time
	gameWonEvent = this.time.addEvent({
		delay: LEVEL_TIME*TIME_MULTIPLIER,
		callback: onGameWon,
		callbackScope: this
		});
    timeText = this.add.text(981, 0, '', {font: '20pt Roboto', fill: '#000'}).setOrigin(1, 0);
    updateTime();

    // gamelost event
    this.events.on('gamelost', onGameLost, this);

}

function updateFruits (scene) {

    if (numberOfCherries <= 0) {
		numberOfCherries = 0;
	}

	for (var i = 0; i < numberOfCherries; i++) {
		cherries[i].setVisible(true);
		apples[i].setVisible(false);
	}
	for (var i = numberOfCherries; i < numberOfCherries+numberOfApples; i++) {
		cherries[i].setVisible(false);
		apples[i].setVisible(true);
	}
	for (var i = numberOfCherries+numberOfApples; i < 20; i++) {
		cherries[i].setVisible(false);
		apples[i].setVisible(false);
	}

    if (numberOfCherries <= 0) {
		scene.events.emit('gamelost');
	}


	for (var i = 0; i < fridge.getData('apples').length; i++) {
		fridge.getData('apples')[i].setVisible(i < numberOfApplesInFridge);
	}
}

function updateTime() {
	var timeRemaining = LEVEL_TIME - gameWonEvent.getElapsedSeconds();
	timeText.setText(Math.floor(timeRemaining/60).toString().padStart(2, '0')
	                 + ':'
	                 + Math.floor(timeRemaining % 60).toString().padStart(2, '0'));

}

function updateBarks() {
	// remove barks that are out of bounds
	barks.children.each(function (child) {
		if (Math.abs(child.x) > 1000 || Math.abs(child.y) > 1000) {
			// the bark is definitely out of bounds
			child.destroy()
		}
	});
}

function bark(dog) {
	console.log('bark');
	dogMouth = dog.getCenter().add(new Phaser.Math.Vector2(100, -75));
	// this is the offset of the cake from the mouth of the dog
	offset = cake.getCenter().subtract(dogMouth);
	rotation = offset.angle();
	velocity = offset.normalize().scale(BARK_SPEED);

	barks.create(dogMouth.x, dogMouth.y, 'barking')
	     .setRotation(rotation)
	     .setVelocityX(velocity.x)
	     .setVelocityY(velocity.y);

    barkingSound.play();
}


function update ()
{
    catJump();

    if (gameOver)
    {
        return;
    }

    if (cursors.left.isDown)
    {
        cake.setVelocityX(-CAKE_SPEED);
        cake.anims.play('left', true);
     }
	else if (cursors.right.isDown)
	{
		cake.setVelocityX(CAKE_SPEED);
		cake.anims.play('right', true);
	}
	else
	{
		cake.setVelocityX(0);
		cake.anims.play('turn');
	}

	if (cursors.up.isDown && cake.body.touching.down)
	{
		cake.setVelocityY(-330);
	}

	updateTime();
	updateFruits(this);
	updateBarks();
}

function onPointerDown() {
	console.log('onPointerDown');

	if (numberOfApples > 0) {
		cakePosition = cake.getCenter();
		cakeVelocity = new Phaser.Math.Vector2().copy(cake.body.velocity);
		mousePosition = new Phaser.Math.Vector2(this.input.localX,
												 this.input.localY);
		throwDirection = mousePosition.subtract(cakePosition).normalize();
		appleVelocity = cakeVelocity.add(throwDirection.scale(THROW_SPEED));

		appleProjectiles.create(cake.x, cake.y, 'apple')
						.setVelocityX(appleVelocity.x)
						.setVelocityY(appleVelocity.y);
		numberOfApples--;
	}
}

function cakeHitFridge(cake, fridge) {
	console.log('cakeHitFridge', this.time.now, fridge.getData('apples'));
	emptyAppleSlots = 10-numberOfApples;
	if (emptyAppleSlots < numberOfApplesInFridge) {
		numberOfApplesInFridge -= emptyAppleSlots;
		numberOfApples += emptyAppleSlots;
	} else {
		numberOfApples += numberOfApplesInFridge;
		numberOfApplesInFridge = 0;
	}
}

function kittyHitWall(kitty, wall) {
	console.log('kittyHitWall');
	kitty.setData('velocityX', -kitty.getData('velocityX'));
	kitty.setVelocityX(kitty.getData('velocityX'));

    catDirection(kitty);

    if (kitty.y > 300 && kitty.getData('wallHits') >= kitty.getData('wallHitsJump')) {
		crazyCat2Sound.play();
		kitty.setVelocityY(-200);
		kitty.setData('wallHitsJump', Phaser.Math.Between(1, 5));
		kitty.setData('wallHits', 0);
    }

    var hits = kitty.getData('wallHits');
    kitty.setData('wallHits', hits+1);
}

function kittyHitDog(kitty, wall) {
	miauSound.play();
	kitty.setData('velocityX', -kitty.getData('velocityX'));
	kitty.setVelocityX(kitty.getData('velocityX'));
    kitty.setVelocityY(-300);
    catDirection(kitty);
}

function catDirection(kitty) {
    var velocity = kitty.getData('velocityX');
    if (velocity < 0) {
        kitty.anims.play('leftCatWalk', true);
    } else {
        kitty.anims.play('rightCatWalk', true);
    }
    kitty.setData('hungry', true);
}

function catJump() {
    var dice = Phaser.Math.Between(1, 70);
    if (dice == 1 && kitty.y > 550) {
        crazyCat1Sound.play();
        kitty.setVelocityY(-600);
        kitty.setData('hungry', 1);
    }
}

function onAppleHitDog(appleProjectile, dog) {
	// an apple hit a dog
	appleProjectile.destroy();
	dog.getData('barkingTimer').paused = true;
	dog.getData('sleepingTimer').paused = false;
}

function onkittensHit(cake, kitty) {
    if(kitty.getData('hungry')) {
        numberOfCherries--;
    }
    kitty.setData('hungry', false);
}

function onAppleHitKitten(appleProjectile, kitten) {
	// an apple hit a kitten
	appleProjectile.destroy();
	kitty.setData('hungry', false);
}

function onBarkHit(cake, bark) {
	// the cake was hit by a bark
	bark.destroy();
	numberOfCherries--;
}

function onGameWon () {
	stopGame(this);
	this.add.text(WIDTH/2, HEIGHT/2, 'You won', {font: '40pt Roboto', fill: '#000'}).setOrigin(0.5, 0.5);
}

function onGameLost () {
	stopGame(this);
	this.add.text(WIDTH/2, HEIGHT/2, 'You lost', {font: '40pt Roboto', fill: '#000'}).setOrigin(0.5, 0.5);
}

function stopGame(scene) {
	scene.physics.pause();
	scene.time.removeAllEvents();
	background.off('pointerdown');
	gameOver = true;
}
