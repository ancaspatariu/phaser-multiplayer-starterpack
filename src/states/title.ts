import * as Assets from '../assets';
import { Client } from './client';

declare var io: any;

export default class Title extends Phaser.State {

    private client = new Client;
    private backgroundTemplateSprite: Phaser.Sprite = null;

    private allPlayers = {};
    private cursors;

    addPlayer(player) {
        this.allPlayers[player.id] = this.add.sprite(player.x, player.y, Assets.Spritesheets.SpritesheetsMetalslugMummy374518.getName());
        this.allPlayers[player.id].animations.add('walk');
        this.allPlayers[player.id].animations.play('walk', 30, true);
    }

    removePlayer(player) {
        this.allPlayers[player.id].destroy();
        delete this.allPlayers[player.id];
    }

    public create(): void {
        this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, Assets.Images.ImagesBackgroundTemplate.getName());
        this.backgroundTemplateSprite.anchor.setTo(0.5);

        this.game.camera.flash(0x000000, 1000);

        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.client.sendTest();
        this.client.joinGame();

        this.client.socket.on('newplayer', player => {
            this.addPlayer(player);
        });

        this.client.socket.on('remove', player => {
            this.removePlayer(player);
        });

        this.client.socket.on('allplayers', (data) => {
            data.map(player => {
                this.addPlayer(player);
            });
        });

        this.client.socket.on('move', (player) => {
            this.allPlayers[player.id].x = player.x;
            this.allPlayers[player.id].y = player.y;
        });
    }

    public update() {
        switch (true) {
            case (this.cursors.down.isDown):
                this.client.sendMovement('down');
                break;
            case (this.cursors.up.isDown):
                this.client.sendMovement('up');
                break;
            case (this.cursors.right.isDown):
                this.client.sendMovement('right');
                break;
            case (this.cursors.left.isDown):
                this.client.sendMovement('left');
                break;
        }
    }

}
