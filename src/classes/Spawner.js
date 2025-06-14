
import Slime from "./Slime.js";

export default class Spawner {

    /**
     * @param {Phaser.Scene} scene - Reference to your Level scene
     * @param {Phaser.GameObjects.Group} slimeGroup - The group where slimes go
     * @param {Phaser.Tilemaps.TilemapLayer} limitesLayer - To add collisions
     */
    constructor(scene, slimeGroup, limitesLayer) {
        this.scene = scene;
        this.slimeGroup = slimeGroup;
        this.limitesLayer = limitesLayer;

        this.spawnDelay = 1000; // ms → spawn every 3 sec
        this.maxSlimes = 10;    // Max slimes at once
        this.level = 1;         // Game level → makes slimes stronger

        this.startSpawning();
    }

    startSpawning() {
        this.scene.time.addEvent({
            delay: this.spawnDelay,
            callback: () => {
                if (this.slimeGroup.countActive(true) < this.maxSlimes) {
                    this.spawnSlime();
                }
            },
            loop: true
        });
    }

    spawnSlime() {
        const x = Phaser.Math.Between(100, this.scene.map.widthInPixels - 100);
        const y = Phaser.Math.Between(100, this.scene.map.heightInPixels - 100);

        const slime = new Slime(this.scene, x, y);

        // Make slime stronger based on level
        slime.hp = 50 + this.level * 20;
        slime.maxHp = slime.hp;
        slime.speed = 40 + this.level * 5;

        this.slimeGroup.add(slime);
        this.scene.physics.add.collider(slime, this.limitesLayer);
    }

    increaseDifficulty() {
        this.level += 1;
    }
}
