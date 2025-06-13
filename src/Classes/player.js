export default class Player extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y, texture) {
        super(scene, x, y, texture, 0);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setCollideWorldBounds(true);

        this.hp = 100;
        this.maxHp = 100;
        this.level = 1;
        this.speed = 200;

        this.play('Player');
    }

    update(cursors) {
        this.body.setVelocity(0);

        if (cursors.left.isDown) {
            this.body.setVelocityX(-this.speed);
            this.flipX = true;
        } else if (cursors.right.isDown) {
            this.body.setVelocityX(this.speed);
            this.flipX = false;
        }

        if (cursors.up.isDown) {
            this.body.setVelocityY(-this.speed);
        } else if (cursors.down.isDown) {
            this.body.setVelocityY(this.speed);
        }
    }
}
