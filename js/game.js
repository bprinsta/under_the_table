var PIXEL_SIZE = 16;

var WorldScene = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize: function WorldScene ()
    {
        Phaser.Scene.call(this, { key: 'WorldScene' });
    },

    preload: function (){},

    playerAnimations: function()
    {
        //  animation with key 'left', we don't need left and right as we will use one and flip the sprite
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13]}),
            frameRate: 10,
            repeat: -1
        });
        // animation with key 'right'
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { frames: [1, 7, 1, 13] }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { frames: [2, 8, 2, 14]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { frames: [ 0, 6, 0, 12 ] }),
            frameRate: 10,
            repeat: -1
        });
    },

    policeAnimations: function()
    {
        this.anims.create({
            key: 'o_left',
            frames: this.anims.generateFrameNumbers('officer', { frames: [4, 5, 6, 7]}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'o_right',
            frames: this.anims.generateFrameNumbers('officer', { frames: [8, 9, 10, 11]}),
            frameRate: 10,
            repeat: -1
        });  
        this.anims.create({
            key: 'o_up',
            frames: this.anims.generateFrameNumbers('officer', { frames: [12, 13, 14, 15]}),
            frameRate: 10,
            repeat: -1
        });  
        this.anims.create({
            key: 'o_down',
            frames: this.anims.generateFrameNumbers('officer', { frames: [0, 1, 2, 3]}),
            frameRate: 10,
            repeat: -1
        });  


    },

    create: function ()
    {
        console.log(this.level);
        
        var map;
        //if (this.level == 0) 
        {
            map = this.add.tilemap('map0'); 
        }
        // else 
        {
         //   map = this.add.tilemap('map1');
        }

        // first parameter is the name of the tilemap in tiled
        var tiles = map.addTilesetImage('modern', 'tiles');
        
        // creating the layers
        var ground = map.createStaticLayer('Below Player', tiles, 0, 0);
        var obstacles = map.createStaticLayer('World Level', tiles, 0, 0);
        var aboveLayer = map.createStaticLayer('Above Player', tiles, 0, 0);
        
        // make all tiles in obstacles collidable
        obstacles.setCollisionByExclusion([-1]);
        // set above layer depth
        aboveLayer.setDepth(10);

        // set player animation frames
        this.playerAnimations();
        this.playerSpeed = 80;

        const spawnPoint = map.findObject("Objects", obj => obj.name === "Player Spawn");
        const endPoint = map.findObject("Objects", obj => obj.name === "Portal");

        // our player sprite created through the phycis system
        this.player = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'player', 1);

        this.portal = this.physics.add.sprite(endPoint.x, endPoint.y, 'portal');

        //Phaser.Actions.ScaleXY(this.portal, 0.5, 0.5);


        // don't go out of the map
        this.physics.world.bounds.width = map.widthInPixels;
        this.physics.world.bounds.height = map.heightInPixels;
        this.player.setCollideWorldBounds(true);
        
        // don't walk on objects
        this.physics.add.collider(this.player, obstacles);
      

        // limit camera to map
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.roundPixels = true; // avoid tile bleed
    
        // user input
        //this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors = this.input.keyboard.addKeys({
            up:Phaser.Input.Keyboard.KeyCodes.W,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D
        });

        // police
        this.enemies = this.physics.add.group({
            key: 'officer', 
            repeat: 4,
            setXY: {
                x: 5 * PIXEL_SIZE,
                y: 6 * PIXEL_SIZE,
                stepX: 4 * PIXEL_SIZE,
                stepY: 4 * PIXEL_SIZE
            }
        })

        this.enemies2 = this.physics.add.group({
            key: 'officer', 
            repeat: 2,
            setXY: {
                x: 5 * PIXEL_SIZE,
                y: 15 * PIXEL_SIZE,
                stepX: 5 * PIXEL_SIZE
            }
        })

        var police_points = []
        this.policeAnimations();

        Phaser.Actions.ScaleXY(this.enemies2.getChildren(), -0.5, -0.5);
        Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);
        
        // where the enemies will be
        this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        this.spawns2 = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
       
        this.enemies.getChildren().forEach(element => {
            this.spawns.create(element.x - 32, element.y, 48, 16); 
        });

        this.enemies2.getChildren().forEach(element => {
            this.spawns2.create(element.x, element.y - 30, 16, 32); 
        });

        var tween = this.tweens.add({
            targets: this.enemies.getChildren(),
            // y: '+=100',
            x: '+= 80',
            ease: 'Linear',
            duration: 1000,
            repeat: -1,
            yoyo: true
        });
        var tween2 = this.tweens.add({
            targets: this.spawns.getChildren(),
            // y: '+=100',
            x: '+= 80',
            ease: 'Linear',
            duration: 1000,
            //delay: 500,
            repeat: -1,
            yoyo: true
        });

        this.tweens.add({
            targets: this.enemies2.getChildren(),
            y: '-=48',
            // x: '+= 80',
            ease: 'Linear',
            duration: 1600,
            repeat: -1,
            yoyo: true
        });

        this.tweens.add({
            targets: this.spawns2.getChildren(),
            y: '-=48',
            // x: '+= 80',
            ease: 'Linear',
            duration: 1600,
            //delay: 500,
            repeat: -1,
            yoyo: true
        });

        this.enemies.getChildren().forEach(element => {
            element.anims.play('o_down', true);
        });

        // add collider
        this.physics.add.overlap(this.player, this.enemies, this.gameOver, false, this);
        this.physics.add.overlap(this.player, this.enemies2, this.gameOver, false, this);

        this.physics.add.overlap(this.player, this.spawns, this.gameOver, false, this);
        this.physics.add.overlap(this.player, this.spawns2, this.gameOver, false, this);

        this.physics.add.overlap(this.player, this.portal, this.gameWin, false, this);
    },
    updatePlayerAnimations: function ()
    {
        this.player.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(- this.playerSpeed);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX( this.playerSpeed);
        }

        // Vertical movement
        if (this.cursors.up.isDown)
        {
            this.player.body.setVelocityY(-this.playerSpeed);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.setVelocityY( this.playerSpeed);
        }        

        // Update the animation last and give left/right animations precedence over up/down animations
        if (this.cursors.left.isDown)
        {
            this.player.anims.play('left', true);
            this.player.flipX = true;
        }
        else if (this.cursors.right.isDown)
        {
            this.player.anims.play('right', true);
            this.player.flipX = false;
        }
        else if (this.cursors.up.isDown)
        {
            this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.anims.play('down', true);
        }
        else
        {
            this.player.anims.stop();
        }

    },
    updatePoliceAnimations: function ()
    {
        this.enemies.getChildren().forEach(element => {
            if (element.body.velocity.x < 0)
            {
                    element.anims.play('o_left', true);
                    element.flipX = true;
            }
            else if (element.body.velocity.x > 0)
            {
                    element.anims.play('o_right', true);
                    element.flipX = true;
            }
            else if (element.body.velocity.y < 0)
            {
                    element.anims.play('o_up', true);
            }
            else if (element.body.velocity.y > 0)
            {
                    element.anims.play('o_down', true);
            }
            else
            {
                    element.anims.stop();
            }
        });

        this.enemies2.getChildren().forEach(element => {
            if (element.body.velocity.x < 0)
            {
                    element.anims.play('o_left', true);
                    element.flipX = true;
            }
            else if (element.body.velocity.x > 0)
            {
                    element.anims.play('o_right', true);
                    element.flipX = true;
            }
            else if (element.body.velocity.y < 0)
            {
                    element.anims.play('o_up', true);
            }
            else if (element.body.velocity.y > 0)
            {
                    element.anims.play('o_down', true);
            }
            else
            {
                    element.anims.stop();
            }
        });
    },
    update: function (time, delta)
    {
    //    this.controls.update(delta);
        this.updatePlayerAnimations();
        this.updatePoliceAnimations();

        this.enemies.getChildren().forEach(element => {
            element.body.setVelocityX(16);
        });
        this.enemies2.getChildren().forEach(element => {
            element.body.setVelocityY(-1);
        });
       //  console.log(this.enemies.getChildren())
    },
    gameOver: function()
    {
        // this.sound.stop();

       // this.sound.play('alert');

        // shake the world
        this.cameras.main.shake(300);
        
        // fade camera
        this.time.delayedCall(250, function() {
            this.cameras.main.fade(250);
        }, [], this);

        // restart game
        this.time.delayedCall(500, function() {
            this.scene.restart();
        }, [], this);
    },
    gameWin: function()
    {
        // this.sound.stop();

        // shake the world
        // this.cameras.main.shake(300);
        this.level = 1;
        
        // fade camera
        this.time.delayedCall(250, function() {
            this.cameras.main.fade(250);
        }, [], this);

        // restart game
        this.time.delayedCall(500, function() {
            this.scene.start('WorldScene');
        }, [], this);
    }
});

var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 320,
    height: 240,
    zoom: 2,
    pixelArt: true,
    audio: {
        disableWebAudio: false
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false // set to true to view zones
        }
    },
    scene: [
        TitleScene,
        BootScene,
        WorldScene
    ]
};
var game = new Phaser.Game(config);

//game.scene.add('TitleScene', titleScene);
//game.scene.start('TitleScene');