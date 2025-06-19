
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class StartMenu extends Phaser.Scene {

	constructor() {
		super("StartMenu");

		/* START-USER-CTR-CODE */
		// Menu state management
		this.showingCharacterSelect = false;
		this.selectedCharacter = null;
		this.playerName = '';
		/* END-USER-CTR-CODE */
	}

	/** @returns {void} */
	editorCreate() {

		const mainMenuBG = this.add.image(0, 0, "BG2");
		mainMenuBG.setOrigin(0, 0);
		
		const imageWidth = mainMenuBG.width;
		const imageHeight = mainMenuBG.height;
		
		this.cameras.main.setBounds(0, 0, imageWidth, imageHeight);
		
		const centerX = (1280 - imageWidth) / 2;
		const centerY = (720 - imageHeight) / 2;
		this.cameras.main.setViewport(centerX, centerY, imageWidth, imageHeight);

		const titleImage = this.add.image(imageWidth / 2, imageHeight / 2 - 120, 'Title');
		titleImage.setOrigin(0.5, 0.5);
		titleImage.setScale(0.7); 

		const buttonSpacing = 120; 
		const buttonOffsetY = 100; 
		
		const dudeMonster = this.add.image(imageWidth / 2 - 225, imageHeight / 2 - 180, 'Dude_Monster');
		dudeMonster.setOrigin(0.5, 0.5);
		dudeMonster.setScale(2); 
		dudeMonster.setFlipX(true); 
		
		const pinkMonster = this.add.image(imageWidth / 2 + 290, imageHeight / 2 - 50, 'Pink_Monster');
		pinkMonster.setOrigin(0.5, 0.5);
		pinkMonster.setScale(2); 
		
		this.titleImage = titleImage;
		this.originalDude = dudeMonster;
		this.originalPink = pinkMonster; 
		
		const startButton = this.add.image(imageWidth / 2, imageHeight / 2 + buttonOffsetY, 'Start');
		startButton.setOrigin(0.5, 0.5);
		startButton.setScale(0.15); 
		startButton.setInteractive({ useHandCursor: true });
		
		startButton.on('pointerover', () => {
			startButton.setScale(0.155); 
			startButton.setTint(0xffff99); 
		});
		
		startButton.on('pointerout', () => {
			startButton.setScale(0.15); 
			startButton.clearTint();
		});
		
		startButton.on('pointerdown', () => {
			this.showCharacterSelection(imageWidth, imageHeight, startButton, exitButton);
		});

		const exitButton = this.add.image(imageWidth / 2, imageHeight / 2 + buttonOffsetY + buttonSpacing, 'Exit');
		exitButton.setOrigin(0.5, 0.5);
		exitButton.setScale(0.15);
		exitButton.setInteractive({ useHandCursor: true });
		
		exitButton.on('pointerover', () => {
			exitButton.setScale(0.155);
			exitButton.setTint(0xffff99);
		});
		
		exitButton.on('pointerout', () => {
			exitButton.setScale(0.15);
			exitButton.clearTint();
		});
		
		exitButton.on('pointerdown', () => {
				window.close();
		});

		this.events.emit("scene-awake");
	}



	create() {

		this.editorCreate();
		
		this.startMusic = this.sound.add('start', { loop: true, volume: 0.4 });
		this.startMusic.play();
	}

	showCharacterSelection(imageWidth, imageHeight, startButton, exitButton) {

		startButton.setVisible(false);
		exitButton.setVisible(false);
		

		this.titleImage.setVisible(false);
		this.originalDude.setVisible(false);
		this.originalPink.setVisible(false);


		const boxWidth = 200;
		const boxHeight = 250;
		const spacing = 100;
		

		const dudeBoxX = Math.floor(imageWidth / 2 - boxWidth - spacing / 2);
		const dudeBoxY = Math.floor(imageHeight / 2 - boxHeight / 2);
		const dudetteBoxX = Math.floor(imageWidth / 2 + spacing / 2);
		const dudetteBoxY = Math.floor(imageHeight / 2 - boxHeight / 2);
		
		const dudeBox = this.add.graphics();
		dudeBox.fillStyle(0x333333, 0.8);
		dudeBox.fillRect(dudeBoxX, dudeBoxY, boxWidth, boxHeight);
		dudeBox.lineStyle(2, 0xffffff); 
		dudeBox.strokeRect(dudeBoxX + 0.5, dudeBoxY + 0.5, boxWidth - 1, boxHeight - 1); 
		dudeBox.setInteractive(new Phaser.Geom.Rectangle(dudeBoxX, dudeBoxY, boxWidth, boxHeight), Phaser.Geom.Rectangle.Contains);
		
		const dudetteBox = this.add.graphics();
		dudetteBox.fillStyle(0x333333, 0.8);
		dudetteBox.fillRect(dudetteBoxX, dudetteBoxY, boxWidth, boxHeight);
		dudetteBox.lineStyle(2, 0xffffff); 
		dudetteBox.strokeRect(dudetteBoxX + 0.5, dudetteBoxY + 0.5, boxWidth - 1, boxHeight - 1); 
		dudetteBox.setInteractive(new Phaser.Geom.Rectangle(dudetteBoxX, dudetteBoxY, boxWidth, boxHeight), Phaser.Geom.Rectangle.Contains);
		
		const dudeCharImg = this.add.image(imageWidth / 2 - spacing / 2 - boxWidth / 2, imageHeight / 2 - 20, 'Dude_Monster');
		dudeCharImg.setScale(1.5);
		dudeCharImg.setFrame(0);
		
		const dudetteCharImg = this.add.image(imageWidth / 2 + spacing / 2 + boxWidth / 2, imageHeight / 2 - 20, 'Pink_Monster');
		dudetteCharImg.setScale(1.5);
		
		const dudeLabel = this.add.text(imageWidth / 2 - spacing / 2 - boxWidth / 2, imageHeight / 2 + 80, 'DUDE', {
			fontSize: '24px',
			fill: '#ffffff',
			fontStyle: 'bold',
			stroke: '#000000',
			strokeThickness: 4
		});
		dudeLabel.setOrigin(0.5);
		
		const dudetteLabel = this.add.text(imageWidth / 2 + spacing / 2 + boxWidth / 2, imageHeight / 2 + 80, 'DUDETTE', {
			fontSize: '24px',
			fill: '#ffffff',
			fontStyle: 'bold',
			stroke: '#000000',
			strokeThickness: 4
		});
		dudetteLabel.setOrigin(0.5);
		
		const nameInputY = imageHeight / 2 + 180;
		
		const nameLabel = this.add.text(imageWidth / 2, nameInputY - 30, 'ENTER YOUR NAME:', {
			fontSize: '20px',
			fill: '#ffffff',
			fontStyle: 'bold',
			stroke: '#000000',
			strokeThickness: 3
		});
		nameLabel.setOrigin(0.5);
		
		const nameInput = document.createElement('input');
		nameInput.type = 'text';
		nameInput.placeholder = 'Player Name';
		nameInput.maxLength = 15;
		nameInput.style.position = 'absolute';
		nameInput.style.left = '50%';
		nameInput.style.top = `${nameInputY}px`;
		nameInput.style.transform = 'translateX(-50%)';
		nameInput.style.padding = '8px';
		nameInput.style.fontSize = '16px';
		nameInput.style.textAlign = 'center';
		nameInput.style.border = '2px solid #ffffff';
		nameInput.style.borderRadius = '5px';
		nameInput.style.backgroundColor = '#333333';
		nameInput.style.color = '#ffffff';
		nameInput.style.outline = 'none';
		nameInput.value = 'User';
		
		document.body.appendChild(nameInput);
		nameInput.focus();
		nameInput.select();
		this.nameInput = nameInput;
		
		const chooseText = this.add.text(imageWidth / 2, imageHeight / 2 - 180, 'CHOOSE YOUR CHARACTER', {
			fontSize: '32px',
			fill: '#ffffff',
			fontStyle: 'bold',
			stroke: '#000000',
			strokeThickness: 4
		});
		chooseText.setOrigin(0.5);
		
		dudeBox.on('pointerdown', () => {
			const playerName = this.nameInput ? this.nameInput.value.trim() || 'Anonymous' : 'Anonymous';
			this.selectedCharacter = 'dude';
			
			if (this.nameInput) {
				document.body.removeChild(this.nameInput);
				this.nameInput = null;
			}
			
			// Stop start music before transitioning
			if (this.startMusic) {
				this.startMusic.stop();
			}
			
			this.scene.start('Level', { 
				selectedCharacter: this.selectedCharacter,
				playerName: playerName
			});
		});
		
		dudetteBox.on('pointerdown', () => {
			const playerName = this.nameInput ? this.nameInput.value.trim() || 'Anonymous' : 'Anonymous';
			this.selectedCharacter = 'dudette';
			
			if (this.nameInput) {
				document.body.removeChild(this.nameInput);
				this.nameInput = null;
			}
			
			// Stop start music before transitioning
			if (this.startMusic) {
				this.startMusic.stop();
			}
			
			this.scene.start('Level', { 
				selectedCharacter: this.selectedCharacter,
				playerName: playerName
			});
		});
		
		dudeBox.on('pointerover', () => {
			dudeBox.clear();
			dudeBox.fillStyle(0x555555, 0.8);
			dudeBox.fillRect(imageWidth / 2 - boxWidth - spacing / 2, imageHeight / 2 - boxHeight / 2, boxWidth, boxHeight);
			dudeBox.lineStyle(3, 0xffffff); 
			dudeBox.strokeRect(imageWidth / 2 - boxWidth - spacing / 2, imageHeight / 2 - boxHeight / 2, boxWidth, boxHeight);
		});
		
		dudeBox.on('pointerout', () => {
			dudeBox.clear();
			dudeBox.fillStyle(0x333333, 0.8);
			dudeBox.fillRect(imageWidth / 2 - boxWidth - spacing / 2, imageHeight / 2 - boxHeight / 2, boxWidth, boxHeight);
			dudeBox.lineStyle(3, 0xffffff); 
			dudeBox.strokeRect(imageWidth / 2 - boxWidth - spacing / 2, imageHeight / 2 - boxHeight / 2, boxWidth, boxHeight);
		});
		
		dudetteBox.on('pointerover', () => {
			dudetteBox.clear();
			dudetteBox.fillStyle(0x555555, 0.8);
			dudetteBox.fillRect(imageWidth / 2 + spacing / 2, imageHeight / 2 - boxHeight / 2, boxWidth, boxHeight);
			dudetteBox.lineStyle(3, 0xffffff); 
			dudetteBox.strokeRect(imageWidth / 2 + spacing / 2, imageHeight / 2 - boxHeight / 2, boxWidth, boxHeight);
		});
		
		dudetteBox.on('pointerout', () => {
			dudetteBox.clear();
			dudetteBox.fillStyle(0x333333, 0.8); 
			dudetteBox.fillRect(imageWidth / 2 + spacing / 2, imageHeight / 2 - boxHeight / 2, boxWidth, boxHeight);
			dudetteBox.lineStyle(3, 0xffffff); 
			dudetteBox.strokeRect(imageWidth / 2 + spacing / 2, imageHeight / 2 - boxHeight / 2, boxWidth, boxHeight);
		});
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
