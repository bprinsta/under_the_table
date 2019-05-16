var BootScene = new Phaser.Class({
    Extends: Phaser.Scene,
    
    initialize: function BootScene ()
    {
        Phaser.Scene.call(this, { key: 'BootScene' });
    },

    preload: function ()
    {
        // map tiles
        // this.load.image('tiles', 'assets/map/spritesheet.png');
        this.load.image('tiles', 'assets/map/KennyRogue/roguelike-modern-city-pack/Spritesheet/roguelikeCity_magenta.png');
        
        // map in json format
        //this.load.tilemapTiledJSON('map', 'assets/map/map.json');
        this.load.tilemapTiledJSON('map1', 'assets/map/level1.json');
        this.load.tilemapTiledJSON('map0', 'assets/map/level0.json');
        
        // our two characters
        this.load.spritesheet('player', 'assets/RPG_assets.png', { frameWidth: 16, frameHeight: 16 });
        this.load.spritesheet('boy', 'assets/main_spritesheet.png', { frameWidth: 32, frameHeight: 36, spacing: 16 });
        
        // load police officer
        this.load.spritesheet('officer', 'assets/officer.png', { frameWidth: 32, frameHeight: 48});

        // load portal
        this.load.image('portal', 'assets/portal_small.png');

        this.load.audio('music', 'assets/Battle Theme II v1.2.wav');
        // this.load.audio('alert', 'assets/pokemon.wav');
    },

    create: function ()
    {
       this.sound.add('music');
        // this.sound.add('alert');
        this.sound.play('music');
        // this.sound.once('complete', this.gameOver);
        this.level = 0;

        // start the WorldScene
        this.scene.start('WorldScene');
    }
});