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

    police: function(x, y)
    {
        var police = this.physics.add.sprite(300, 75, 'officer', 6);
    },

    create: function ()
    {
        // create the map
        var map = this.add.tilemap('map');

        // first parameter is the name of the tilemap in tiled
        // var tiles = map.addTilesetImage('spritesheet', 'tiles');
        var tiles = map.addTilesetImage('modern', 'tiles');
        
        // creating the layers
        //var grass = map.createStaticLayer('Grass', tiles, 0, 0);
        //var obstacles = map.createStaticLayer('Obstacles', tiles, 0, 0);
        var ground = map.createStaticLayer('Below Player', tiles, 0, 0);
        var obstacles = map.createStaticLayer('World Level', tiles, 0, 0);
        var aboveLayer = map.createStaticLayer('Above Player', tiles, 0, 0);
        
        // make all tiles in obstacles collidable
        obstacles.setCollisionByExclusion([-1]);
        // set above layer depth
        aboveLayer.setDepth(10);

        // set player animation frames
        this.playerAnimations();
                
        // our player sprite created through the phycis system
        this.player = this.physics.add.sprite(18, 60, 'player', 6);


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
                x:180,
                y: 48,
                stepX: 96,
                stepY: 0
            }
        })
        Phaser.Actions.ScaleXY(this.enemies.getChildren(), -0.5, -0.5);
        
        // where the enemies will be
        this.spawns = this.physics.add.group({ classType: Phaser.GameObjects.Zone });
        /* for(var i = 0; i < 6; i++) {
            // var x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
            // var y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
            
            // parameters are x, y, width, heights
            // this.spawns.create(x, y, 16, 16);
            
        } */
        this.enemies.getChildren().forEach(element => {
            this.spawns.create(element.x, element.y + 48, 16, 80); 
        });

        var tween = this.tweens.add({
            targets: this.enemies.getChildren(),
            y: '+=100',
            ease: 'Linear',
            duration: 1000,
            repeat: -1,
            yoyo: true
        });

        // add collider
        this.physics.add.overlap(this.player, this.enemies, this.gameOver, false, this);
        this.physics.add.overlap(this.player, this.spawns, this.gameOver, false, this);
    },
    onMeetEnemy: function(player, zone) {        
        // we move the zone to some other location
        zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width);
        zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);
        this.spawns.create(x, y + 16, 16, 16); 

        // shake the world
        this.cameras.main.shake(300);
        
    },
    updatePlayerAnimations: function ()
    {
        this.player.body.setVelocity(0);

        // Horizontal movement
        if (this.cursors.left.isDown)
        {
            this.player.body.setVelocityX(-80);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.body.setVelocityX(80);
        }

        // Vertical movement
        if (this.cursors.up.isDown)
        {
            this.player.body.setVelocityY(-80);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.body.setVelocityY(80);
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

        // console.log(this.player.body.x)
    },
    update: function (time, delta)
    {
    //    this.controls.update(delta);
        this.updatePlayerAnimations();
    },
    gameOver: function()
    {
        this.playerAlive = false;
        
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
    }
});

var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 320,
    height: 240,
    zoom: 2,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: true // set to true to view zones
        }
    },
    scene: [
        BootScene,
        WorldScene
    ]
};
var game = new Phaser.Game(config);