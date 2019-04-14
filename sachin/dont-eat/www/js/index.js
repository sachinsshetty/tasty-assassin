/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
      document.addEventListener('deviceready', function() {
    var config = {
        type: Phaser.WEBGL,
        parent: 'game',
        //width: 986,
        //height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    };

    var game = new Phaser.Game(config);


    var LEVEL_TIME = 1*60; // in seconds
    var THROW_SPEED = 300;
    var BARKING_COOLDOWN = 3; // in seconds
    var BARK_SPEED = 200;
    var SLEEPING_TIME = 5; // in seconds
    var KITTEN_SPEED = 1000;

    var background;
    var appleProjectiles;

    var platforms;
    var walls;
    var bottoms;
    var cake;
    var dogs;
    var barks;
    var barkingSound;
    var kittens;

    var cherries = [];
    var apples = [];

    // numberOfCherries + numberOfApples needs to be less than 20
    var numberOfCherries = 10;
    var numberOfApples = 0;
    var timeText;

    var gameWonEvent;
    var gameOver = false;

    var cursors;
    var keySpace;


    function preload() {

      // Background
        this.load.image('kitchen', 'img/assets/kitchen.png');

        // Platforms and boundaries
        this.load.image('ground', 'img/assets/platform.png');
        this.load.image('bottom', 'img/assets/bottom.png');
        this.load.image('wall', 'img/assets/wall.png');


    	// Player
        this.load.spritesheet('cake', 'img/assets/cake-sprite.png', { frameWidth: 100, frameHeight: 100 });

        // Food assets
        this.load.image('apple', 'img/assets/food/Apple.png');
        this.load.image('cherry', 'img/assets/food/Cherry.png');
        this.load.image('fish', 'img/assets/food/Fish.png');
        this.load.image('peach', 'img/assets/food/Peach.png');
        this.load.image('strawberry', 'img/assets/food/Strawberry.png');
        this.load.image('tomato', 'img/assets/food/Tomato.png');

        // Dog assets
        this.load.image('dog', 'img/assets/pets/dog.png');
        this.load.image('barking', 'img/assets/projectiles/barking.png');
        this.load.audio('barkingSound', 'img/assets/pets/barking_sound.mp3');

        // Cat assets
        this.load.spritesheet('cat', 'img/assets/pets/cat-sprite.png', { frameWidth: 64, frameHeight: 64 });

    }



    function updateFruits () {
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
        if (gameOver)
        {
            return;
        }

        if (cursors.left.isDown)
        {
            cake.setVelocityX(-160);
            cake.anims.play('left', true);
         }
    	else if (cursors.right.isDown)
    	{
    		cake.setVelocityX(160);
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
    	updateFruits();
    	updateBarks();
    }

    function kittyHitWall(kitty, wall) {
    	console.log('kittyHitWall');
    	kitty.setData('velocityX', -kitty.getData('velocityX'));
    	kitty.setVelocityX(kitty.getData('velocityX'));
    }

    function kittyHitDog(kitty, wall) {
    	console.log('kittyHitDog');
    	kitty.setData('velocityX', -kitty.getData('velocityX'));
    	kitty.setVelocityX(kitty.getData('velocityX'));
    }

    function onBarkHit(cake, bark) {
    	// the cake was hit by a bark
    	numberOfCherries--;
    	bark.destroy();
    	if (numberOfCherries <= 0) {
    		numberOfCherries = 0;
    		updateFruits();
    		this.events.emit('gamelost');
    	}
    }

    function onGameWon () {
      stopGame(this);

    	this.add.text(493, 300, 'You won', {font: '40pt Roboto', fill: '#000'}).setOrigin(0.5, 0.5);
    }

    function onGameLost () {
      stopGame(this);

    	this.add.text(493, 300, 'You lost', {font: '40pt Roboto', fill: '#000'}).setOrigin(0.5, 0.5);

    }

    function stopGame(scene) {
    	scene.physics.pause();
    	scene.time.removeAllEvents();
    	background.off('pointerdown');
    	gameOver = true;
    }


    function onPointerDown() {
    	console.log('onPointerDown');
    	cakePosition = cake.getCenter();
		cakeVelocity = new Phaser.Math.Vector2().copy(cake.body.velocity);
		mousePosition = new Phaser.Math.Vector2(this.input.localX,
												this.input.localY);
		throwDirection = mousePosition.subtract(cakePosition).normalize();
		appleVelocity = cakeVelocity.add(throwDirection.scale(THROW_SPEED));

		appleProjectiles.create(cake.x, cake.y, 'apple')
						.setVelocityX(appleVelocity.x)
						.setVelocityY(appleVelocity.y);
    }

    function onAppleHitDog(appleProjectile, dog) {
    	// an apple hit a dog
    	appleProjectile.destroy();
    	dog.getData('barkingTimer').paused = true;
    	dog.getData('sleepingTimer').paused = false;
    }

    function onAppleHitKitten(appleProjectile, kitten) {
    	// an apple hit a kitten
    	appleProjectile.destroy();
    }



    function create() {

      //  A simple background for our game
      background = this.add.image(493, 300, 'kitchen').setInteractive();
      //  Register a click anywhere on the screen

      background.on('pointerdown', onPointerDown);


      //  The platforms group contains the platforms for the cake
      platforms = this.physics.add.staticGroup();
      //  The walls are the world boundaries on the left and on the right
      walls = this.physics.add.staticGroup();
      //  The bottoms group contains the floor that cats and dogs can walk on
      bottoms = this.physics.add.staticGroup();


      platforms.create(100, 334, 'ground').setVisible(false);
      platforms.create(500, 334, 'ground').setVisible(false);

      //  Here we create the ground.
      bottoms.create(493, 616, 'bottom').setVisible(false);

      //  Here we create walls to the right and to the left of the screen
      walls.create(-16, 300, 'wall').setVisible(false);
      walls.create(986+16, 300, 'wall').setVisible(false);

      //  The fridge_wall contains the wall blocking the cake from falling down
      fridge_wall = this.physics.add.staticGroup();
      fridge_wall.create(765, 300, 'wall').setVisible(false);


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
      delay: BARKING_COOLDOWN*1000,
      callbackScope: this,
      loop: true,
      callback: function () {
        bark(dog);
        },
      }));


      dog.setData('sleepingTimer', this.time.addEvent({
      delay: SLEEPING_TIME*1000,
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


      kittens = this.physics.add.group({ allowGravity: true });
      kitty = kittens.create(955, 536, 'cat')
                     .setVelocityX(KITTEN_SPEED);
      kitty.setData('velocityX', KITTEN_SPEED);


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
      this.physics.add.collider(cake, fridge_wall);
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

    // The time
    gameWonEvent = this.time.addEvent({
      delay: LEVEL_TIME*1000,
      callback: onGameWon,
      callbackScope: this
      });
      timeText = this.add.text(981, 0, '', {font: '20pt Roboto', fill: '#000'}).setOrigin(1, 0);
      updateTime();

      // gamelost event
      this.events.on('gamelost', onGameLost, this);


    }
});


    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
