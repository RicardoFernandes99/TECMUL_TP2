
import Leaderboard from "../classes/Leaderboard.js";

export default class GameOver extends Phaser.Scene {

	constructor() {
		super("GameOver");
	}

	create(data) {
		const { playerName, score, leaderboard } = data;
		
		const overlay = this.add.rectangle(
			this.cameras.main.centerX,
			this.cameras.main.centerY,
			this.cameras.main.width,
			this.cameras.main.height,
			0x000000,
			0.8
		);
		overlay.setScrollFactor(0);
		overlay.setDepth(1000);

		const gameOverText = this.add.text(
			this.cameras.main.centerX,
			80,
			'GAME OVER',
			{
				fontSize: '52px',
				fill: '#ff0000',
				fontStyle: 'bold',
				stroke: '#000000',
				strokeThickness: 5,
				resolution: 2
			}
		);
		gameOverText.setOrigin(0.5);
		gameOverText.setScrollFactor(0);
		gameOverText.setDepth(1001);

		const yourScoreText = this.add.text(
			this.cameras.main.centerX,
			140,
			`Your Score: ${score}`,
			{
				fontSize: '28px',
				fill: '#ffffff',
				fontStyle: 'bold',
				stroke: '#000000',
				strokeThickness: 4,
				resolution: 2
			}
		);
		yourScoreText.setOrigin(0.5);
		yourScoreText.setScrollFactor(0);
		yourScoreText.setDepth(1001);

		this.createLeaderboardWithButton(leaderboard);
	}

	createLeaderboardWithButton(leaderboard) {
		const centerX = this.cameras.main.centerX;
		const centerY = this.cameras.main.centerY;
		
		const cardWidth = 400;
		const cardHeight = 400;
		const cardY = 370;
		
		const cardBg = this.add.rectangle(centerX, cardY, cardWidth, cardHeight, 0x1a1a1a, 0.95);
		cardBg.setStrokeStyle(4, 0xffffff);
		cardBg.setScrollFactor(0);
		cardBg.setDepth(1001);
		
		const titleText = this.add.text(centerX, cardY - cardHeight/2 + 30, 'LEADERBOARD', {
			fontSize: '28px',
			fill: '#ffffff',
			fontStyle: 'bold',
			stroke: '#000000',
			strokeThickness: 4,
			resolution: 3
		});
		titleText.setOrigin(0.5);
		titleText.setScrollFactor(0);
		titleText.setDepth(1002);

		const scores = leaderboard ? leaderboard.getScores() : [];
		
		const startY = cardY - cardHeight/2 + 70;
		
		for (let index = 0; index < 10; index++) {
			const yPos = startY + (index * 28);
			const entry = scores[index];
			
			let scoreColor, fontSize, strokeThickness;
			if (index === 0) {
				scoreColor = '#ffd700';
				fontSize = '18px';
				strokeThickness = 3;
			} else if (index === 1) {
				scoreColor = '#c0c0c0';
				fontSize = '16px';
				strokeThickness = 3;
			} else if (index === 2) {
				scoreColor = '#cd7f32';
				fontSize = '16px';
				strokeThickness = 3;
			} else {
				scoreColor = '#ffffff';
				fontSize = '14px';
				strokeThickness = 2;
			}
			
			if (entry) {
				const rankText = this.add.text(centerX - 170, yPos, `${index + 1}.`, {
					fontSize: fontSize,
					fill: scoreColor,
					fontStyle: index < 3 ? 'bold' : 'normal',
					stroke: '#000000',
					strokeThickness: strokeThickness,
					resolution: 3
				});
				rankText.setOrigin(0, 0.5);
				rankText.setScrollFactor(0);
				rankText.setDepth(1002);
				
				const usernameText = this.add.text(centerX - 140, yPos, entry.username, {
					fontSize: fontSize,
					fill: scoreColor,
					fontStyle: index < 3 ? 'bold' : 'normal',
					stroke: '#000000',
					strokeThickness: strokeThickness,
					resolution: 3
				});
				usernameText.setOrigin(0, 0.5);
				usernameText.setScrollFactor(0);
				usernameText.setDepth(1002);
				
				const scoreText = this.add.text(centerX + 170, yPos, entry.score.toString(), {
					fontSize: fontSize,
					fill: scoreColor,
					fontStyle: index < 3 ? 'bold' : 'normal',
					stroke: '#000000',
					strokeThickness: strokeThickness,
					resolution: 3
				});
				scoreText.setOrigin(1, 0.5);
				scoreText.setScrollFactor(0);
				scoreText.setDepth(1002);
			} else {
				const rankText = this.add.text(centerX - 170, yPos, `${index + 1}.`, {
					fontSize: fontSize,
					fill: '#555555',
					fontStyle: 'normal',
					stroke: '#000000',
					strokeThickness: strokeThickness,
					resolution: 3
				});
				rankText.setOrigin(0, 0.5);
				rankText.setScrollFactor(0);
				rankText.setDepth(1002);
				
				const placeholderText = this.add.text(centerX - 140, yPos, '---', {
					fontSize: fontSize,
					fill: '#555555',
					fontStyle: 'normal',
					stroke: '#000000',
					strokeThickness: strokeThickness,
					resolution: 3
				});
				placeholderText.setOrigin(0, 0.5);
				placeholderText.setScrollFactor(0);
				placeholderText.setDepth(1002);
				
				const scorePlaceholder = this.add.text(centerX + 170, yPos, '0', {
					fontSize: fontSize,
					fill: '#555555',
					fontStyle: 'normal',
					stroke: '#000000',
					strokeThickness: strokeThickness,
					resolution: 3
				});
				scorePlaceholder.setOrigin(1, 0.5);
				scorePlaceholder.setScrollFactor(0);
				scorePlaceholder.setDepth(1002);
			}
		}

		const buttonY = cardY + cardHeight/2 - 35;
		const buttonBg = this.add.rectangle(centerX, buttonY, 160, 45, 0x333333, 0.95);
		buttonBg.setStrokeStyle(3, 0xffffff);
		buttonBg.setScrollFactor(0);
		buttonBg.setDepth(1002);
		buttonBg.setInteractive({ useHandCursor: true });

		const buttonText = this.add.text(centerX, buttonY, 'PLAY AGAIN', {
			fontSize: '18px',
			fill: '#ffffff',
			fontStyle: 'bold',
			stroke: '#000000',
			strokeThickness: 2,
			resolution: 3
		});
		buttonText.setOrigin(0.5);
		buttonText.setScrollFactor(0);
		buttonText.setDepth(1003);

		buttonBg.on('pointerover', () => {
			buttonBg.setFillStyle(0x555555, 0.95);
			buttonBg.setStrokeStyle(3, 0xffffff);
			buttonText.setScale(1.05);
		});

		buttonBg.on('pointerout', () => {
			buttonBg.setFillStyle(0x333333, 0.95);
			buttonBg.setStrokeStyle(3, 0xffffff);
			buttonText.setScale(1);
		});

		buttonBg.on('pointerdown', () => {
			this.scene.stop('GameOver');
			this.scene.stop('Level');
			this.scene.start('StartMenu');
		});
	}
}
