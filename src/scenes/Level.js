// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import Player  from "../classes/Player.js";   // Import Player class
import Slime   from "../classes/Slime.js";    // Import Slime class
import Spawner from "../classes/Spawner.js";  // Import Spawner class
/* END-USER-IMPORTS */

export default class Level extends Phaser.Scene {

    constructor() {
        super("Level");

        /* START-USER-CTR-CODE */
        // nothing to do here
        /* END-USER-CTR-CODE */
    }

    /** @returns {void} */
    editorCreate() {
        this.events.emit("scene-awake");
    }

    /* START-USER-CODE */

    create() {

        const map = this.make.tilemap({ key: 'level-map' });
        this.map = map;
        const tileset = map.addTilesetImage('tiles', 'tiles');
        this.dungeonLayer = map.createLayer('Dungeon', tileset, 0, 0);
        this.limitesLayer = map.createLayer('Limites', tileset, 0, 0);
        this.limitesLayer.setCollisionByExclusion([-1]);

        this.player = new Player(this, 169, 409);

        this.cameras.main
            .setBounds(0, 0, map.widthInPixels, map.heightInPixels)
            .startFollow(this.player)
            .setZoom(1);

        this.editorCreate();

        this.keys = this.input.keyboard.addKeys({
            up:    Phaser.Input.Keyboard.KeyCodes.W,
            down:  Phaser.Input.Keyboard.KeyCodes.S,
            left:  Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D
        });

        this.input.on("pointerdown", pointer => {
            this.player.attack(pointer);
        });

        this.physics.add.collider(this.player, this.limitesLayer);

        this.slimes = this.physics.add.group();
        this.spawner = new Spawner(this, this.slimes, this.limitesLayer);
		this.crystals = this.physics.add.group();

		this.physics.add.overlap(this.player,this.crystals,(player, crystal) => {
			player.gainXp(crystal.getData('xp') || 10);
			crystal.destroy();
		},null,this);

            this.physics.add.overlap(
            [ this.player.projectiles, this.player.explosions ],
            this.slimes,
            (proj, slime) => {
                slime.takeDamage(100);
                proj.destroy();
            }
            );

        this.physics.add.overlap(this.player,this.slimes,(_player, slime) => {
                slime.attack();
            }
        );
    }

    update() {

        this.player.update(this.keys);

        this.player.x = Phaser.Math.Clamp(this.player.x, 0, this.map.widthInPixels);
        this.player.y = Phaser.Math.Clamp(this.player.y, 0, this.map.heightInPixels);

        this.slimes.children.iterate(slime => {
            slime.update(this.player);
        });
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
