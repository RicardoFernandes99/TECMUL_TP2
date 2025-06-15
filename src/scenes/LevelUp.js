export default class LevelUp extends Phaser.Scene {
  constructor() {
    super("LevelUp");
  }

  /**
   * @param {object} data
   * @param {{ key: string, label: string }[]} data.rewards
   * @param {function} data.onSelect
   * @param {number} data.playerLevel
   */
  init(data) {
    this.rewards = data.rewards;
    this.onSelect = data.onSelect;
    this.playerLevel = data.playerLevel || 1;
  }

  create() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    this.add
      .rectangle(0, 0, W, H, 0x000000, 0.5)
      .setOrigin(0);

    const panelW = 320;
    const panelH = 240;
    const panelX = W / 2 - panelW / 2;
    const panelY = H / 2 - panelH / 2;
    const radius = 16;

    const panelGfx = this.add.graphics();

    panelGfx.fillStyle(0xffffff, 1);
    panelGfx.fillRoundedRect(panelX, panelY, panelW, panelH, radius);

    panelGfx.lineStyle(2, 0x888888, 1);
    panelGfx.strokeRoundedRect(panelX, panelY, panelW, panelH, radius);


    this.add
      .text(Math.round(W / 2), Math.round(H / 2 - 70), `Level ${this.playerLevel}!`, {
        fontSize: "24px",
        color: "#333333",
        fontFamily: "Arial",
        fontStyle: "bold",
        resolution: 2 
      })
      .setOrigin(0.5);

    const spacing = 80;
    const count   = this.rewards.length;
    const startX  = W / 2 - ((count - 1) * spacing) / 2;
    const squareSize = 60;

    this.rewards.forEach((reward, i) => {
      const x = Math.round(startX + i * spacing);
      const y = Math.round(H / 2 - 10);

      const square = this.add.graphics();
      square.fillStyle(0x333333, 0.3);
      const squareX = Math.round(x - squareSize/2);
      const squareY = Math.round(y - squareSize/2);
      square.fillRect(squareX, squareY, squareSize, squareSize);
      square.lineStyle(1, 0x000000, 1); 
      square.strokeRect(squareX + 0.5, squareY + 0.5, squareSize - 1, squareSize - 1); 

      const icon = this.add
        .image(x, y, reward.icon)
        .setDisplaySize(squareSize - 10, squareSize - 10) 
        .setInteractive({ cursor: "pointer" });

      const label = this.add
        .text(Math.round(x), Math.round(y + squareSize/2 + 20), reward.label, {
          fontSize: "12px",
          color: "#333333",
          fontFamily: "Arial",
          fontStyle: "bold",
          align: "center",
          wordWrap: { width: 70 },
          resolution: 2 
        })
        .setOrigin(0.5);

      const onHover = () => {
        square.clear();
        square.fillStyle(0x555555, 0.5);
        square.fillRect(squareX, squareY, squareSize, squareSize);
        square.lineStyle(2, 0x000000, 1); 
        square.strokeRect(squareX + 0.5, squareY + 0.5, squareSize - 1, squareSize - 1);
        icon.setDisplaySize(squareSize - 5, squareSize - 5);
        label.setStyle({ color: "#000000", fontSize: "13px", fontStyle: "bold" });
      };
      
      const onOut = () => {
        square.clear();
        square.fillStyle(0x333333, 0.3);
        square.fillRect(squareX, squareY, squareSize, squareSize);
        square.lineStyle(1, 0x000000, 1);
        square.strokeRect(squareX + 0.5, squareY + 0.5, squareSize - 1, squareSize - 1);
        icon.setDisplaySize(squareSize - 10, squareSize - 10);
        label.setStyle({ color: "#333333", fontSize: "12px", fontStyle: "bold" });
      };

      const interactiveArea = this.add
        .rectangle(x, y, squareSize, squareSize, 0x000000, 0)
        .setInteractive({ cursor: "pointer" });

      icon.on("pointerover", onHover);
      icon.on("pointerout", onOut);
      label.on("pointerover", onHover);
      label.on("pointerout", onOut);
      interactiveArea.on("pointerover", onHover);
      interactiveArea.on("pointerout", onOut);

      label.setInteractive({ cursor: "pointer" });

      const onClick = () => {
        this.onSelect(reward);

        this.scene.stop();
        this.scene.resume("Level");
      };

      icon.once("pointerdown", onClick);
      label.once("pointerdown", onClick);
      interactiveArea.once("pointerdown", onClick);
    });
  }
}