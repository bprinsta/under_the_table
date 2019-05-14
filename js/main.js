import TitleScene from './TitleScene';

let titleScene = new TitleScene();
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
            debug: false // set to true to view zones
        }
    }
    //scene:
    /*[
        BootScene,
        WorldScene
    ]*/
};
var game = new Phaser.Game(config);
game.scene.add('TitleScene', titleScene);
game.scene.start('TitleScene');