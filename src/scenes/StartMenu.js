
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class StartMenu extends Phaser.Scene {

	constructor() {
		super("StartMenu");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		const mainMenuBG = this.add.image(0, 0, "MainMenuBG");
		mainMenuBG.setOrigin(0, 0);
		
		const imageWidth = mainMenuBG.width;
		const imageHeight = mainMenuBG.height;
		
		this.cameras.main.setBounds(0, 0, imageWidth, imageHeight);
		
		const centerX = (1280 - imageWidth) / 2;
		const centerY = (720 - imageHeight) / 2;
		this.cameras.main.setViewport(centerX, centerY, imageWidth, imageHeight);

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	create() {

		this.editorCreate();
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
