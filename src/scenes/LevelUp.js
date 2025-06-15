export default class LevelUp extends Phaser.Scene {
  constructor() {
    super("LevelUp");
  }

  /**
   * @param {object} data
   * @param {{ key: string, label: string }[]} data.rewards
   * @param {function} data.onSelect
   */
  init(data) {
    this.rewards = data.rewards;
    this.onSelect = data.onSelect;
  }

  create() {
    const W = this.cameras.main.width;
    const H = this.cameras.main.height;

    // 1️⃣ Dim the world behind
    this.add
      .rectangle(0, 0, W, H, 0x000000, 0.5)
      .setOrigin(0);

    // 2️⃣ Draw the panel with Graphics
    const panelW = 320;
    const panelH = 240;
    const panelX = W / 2 - panelW / 2;
    const panelY = H / 2 - panelH / 2;
    const radius = 16;

    const panelGfx = this.add.graphics();
    // Fill white rounded rect
    panelGfx.fillStyle(0xffffff, 1);
    panelGfx.fillRoundedRect(panelX, panelY, panelW, panelH, radius);
    // Stroke gray border
    panelGfx.lineStyle(2, 0x888888, 1);
    panelGfx.strokeRoundedRect(panelX, panelY, panelW, panelH, radius);

    // 3️⃣ Title text
    this.add
      .text(Math.round(W / 2), Math.round(H / 2 - 70), "New Level!", {
        fontSize: "24px",
        color: "#333333",
        fontFamily: "Arial",
        fontStyle: "bold",
        resolution: 2 // Higher resolution for crisp text
      })
      .setOrigin(0.5);

    // 4️⃣ Reward icons in defined squares
    const spacing = 80;
    const count   = this.rewards.length;
    const startX  = W / 2 - ((count - 1) * spacing) / 2;
    const squareSize = 60; // Define square size

    this.rewards.forEach((reward, i) => {
      const x = Math.round(startX + i * spacing);
      const y = Math.round(H / 2 - 10);

      // Create square background with pixel-perfect positioning
      const square = this.add.graphics();
      square.fillStyle(0x333333, 0.3);
      const squareX = Math.round(x - squareSize/2);
      const squareY = Math.round(y - squareSize/2);
      square.fillRect(squareX, squareY, squareSize, squareSize);
      square.lineStyle(1, 0x000000, 1); // Thinner border for crispness
      square.strokeRect(squareX + 0.5, squareY + 0.5, squareSize - 1, squareSize - 1); // Offset by 0.5 for crisp lines

      // Add icon fitted to square
      const icon = this.add
        .image(x, y, reward.icon)
        .setDisplaySize(squareSize - 10, squareSize - 10) // Fit within square with 5px padding on each side
        .setInteractive({ cursor: "pointer" });

      // Add label text below the square
      const label = this.add
        .text(Math.round(x), Math.round(y + squareSize/2 + 20), reward.label, {
          fontSize: "12px",
          color: "#333333",
          fontFamily: "Arial",
          fontStyle: "bold",
          align: "center",
          wordWrap: { width: 70 },
          resolution: 2 // Higher resolution for crisp text
        })
        .setOrigin(0.5);

      // hover effect for both icon and label
      const onHover = () => {
        square.clear();
        square.fillStyle(0x555555, 0.5);
        square.fillRect(squareX, squareY, squareSize, squareSize);
        square.lineStyle(2, 0x000000, 1); // Keep consistent border thickness
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

      // Add invisible interactive area over the square
      const interactiveArea = this.add
        .rectangle(x, y, squareSize, squareSize, 0x000000, 0)
        .setInteractive({ cursor: "pointer" });

      icon.on("pointerover", onHover);
      icon.on("pointerout", onOut);
      label.on("pointerover", onHover);
      label.on("pointerout", onOut);
      interactiveArea.on("pointerover", onHover);
      interactiveArea.on("pointerout", onOut);

      // Make label interactive too
      label.setInteractive({ cursor: "pointer" });

      // click to choose (icon, label, and square area)
      const onClick = () => {
        // apply the chosen reward
        this.onSelect(reward);

        // close this UI and resume the game
        this.scene.stop();
        this.scene.resume("Level");
      };

      icon.once("pointerdown", onClick);
      label.once("pointerdown", onClick);
      interactiveArea.once("pointerdown", onClick);
    });
  }
}