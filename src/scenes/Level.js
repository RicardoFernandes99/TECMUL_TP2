// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import Player from "../classes/Player.js"; // Import Player class
import Slime from "../classes/Slime.js";   // Import Slime class
/* END-USER-IMPORTS */

export default class Level extends Phaser.Scene {

    constructor() {
        super("Level");

        /* START-USER-CTR-CODE */
        // Write your code here.
        /* END-USER-CTR-CODE */
    }

    /** @returns {void} */
    editorCreate() {

        this.events.emit("scene-awake");
    }

    /** @type {Player} */
    player;

    /** @type {Phaser.Tilemaps.TilemapLayer} */
    dungeonLayer;

    /** @type {Phaser.Tilemaps.TilemapLayer} */
    limitesLayer;

    /** @type {Phaser.GameObjects.Group} */
    slimes;

    /* START-USER-CODE */

    create() {

        // Load the tilemap
        const map = this.make.tilemap({ key: 'level-map' });
        this.map = map;

        // Load the tileset image
        const tileset = map.addTilesetImage('tiles', 'tiles');

        // Create map layers
        this.dungeonLayer = map.createLayer('Dungeon', tileset, 0, 0);

        // Create the Limites layer and enable collision
        this.limitesLayer = map.createLayer('Limites', tileset, 0, 0);
        this.limitesLayer.setCollisionByExclusion([-1]);

        // Create player → using Player class
        this.player = new Player(this, 169, 409, "creature-sheet");

        // Set camera bounds to match map size
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1);

        // Call editorCreate() AFTER map → for UI if needed
        this.editorCreate();

        // Setup input
        this.cursors = this.input.keyboard.createCursorKeys();

        // Enable physics collisions between player and Limites layer
        this.physics.add.collider(this.player, this.limitesLayer);

        // --- SLIMES SETUP ---

        // Create group of slimes
        this.slimes = this.add.group();

        // Example: spawn 1 slime
        const slime = new Slime(this, 500, 300);
        this.slimes.add(slime);

        // Enable collision slime vs limites
        this.physics.add.collider(slime, this.limitesLayer);

        // Optional → collision slime vs player (trigger attack on overlap)
        this.physics.add.overlap(slime, this.player, () => {
            slime.attack();
        });
    }

    update() {

        // Player movement
        this.player.update(this.cursors);

        // Clamp player inside map bounds
        this.player.x = Phaser.Math.Clamp(this.player.x, 0, this.map.widthInPixels);
        this.player.y = Phaser.Math.Clamp(this.player.y, 0, this.map.heightInPixels);

        // Update each slime
        this.slimes.children.iterate(slime => {
            slime.update(this.player);
        });
    }

    /* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here