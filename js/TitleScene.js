class TitleScene extends Phaser.Scene
{
    constructor ()
    {
        super ({key: 'TitleScene'});
    }

    initialize ()
    {
        Phaser.Scene.call(this, { key: 'TitleScene' });
    }

    preload ()
    {
        this.load.image('title_background', 'assets/background.png');
    }

    create ()
    {
        let background = this.add.sprite(0, 0, 'title_background');
        background.setOrigin(0, 0);
        background.setScale(0.23, 0.258);

        // Find way to delay the game from starting
        //this.scene.start('BootScene');
    }
}