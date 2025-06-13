// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import Player from "../classes/Player.js"; // Import Player class
import Slime from "../classes/Slime.js";   // Import Slime class
import Spawner from "../classes/Spawner.js"; // Import Spawner class

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

    /** @type {Spawner} */
    spawner;

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
        this.player = new Player(this, 169, 409);

        // Set camera bounds to match map size
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(1);

        // Call editorCreate() AFTER map → for UI if needed
        this.editorCreate();

        // Setup input
        this.cursors = this.input.keyboard.createCursorKeys();
        this.attackKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Enable physics collisions between player and Limites layer
        this.physics.add.collider(this.player, this.limitesLayer);

        // --- SLIMES SETUP ---

        // Create group of slimes
		this.slimes = this.physics.add.group();

        // Create Spawner → pass scene, group, limites layer
        this.spawner = new Spawner(this, this.slimes, this.limitesLayer);

		// Player projectiles hit slimes
		this.physics.add.overlap(this.player.projectiles, this.slimes, (rock, slime) => {
			slime.takeDamage(10);
			rock.destroy();    // Destroy rock after hit
		});

        // Player first then slime 
		this.physics.add.overlap(this.player,this.slimes,(playerObj, slimeObj) => {
			slimeObj.attack();
		}
		);
    }

    update() {

        // Player movement
        this.player.update(this.cursors);

        // Player attack → SPACE key → pass cursors for direction
        if (Phaser.Input.Keyboard.JustDown(this.attackKey)) {
            this.player.attack(this.cursors);
        }

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
