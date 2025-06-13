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
    const panelW = 300;
    const panelH = 200;
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
      .text(W / 2, H / 2 - 70, "New Level!", {
        fontSize: "24px",
        color: "#333333",
        fontFamily: "Arial",
      })
      .setOrigin(0.5);

    // 4️⃣ Reward icons
    const spacing = 80;
    const count   = this.rewards.length;
    const startX  = W / 2 - ((count - 1) * spacing) / 2;

    this.rewards.forEach((reward, i) => {
      const x = startX + i * spacing;
      const icon = this.add
        .image(x, H / 2, reward.key)
        .setInteractive({ cursor: "pointer" });

      // hover effect
      icon.on("pointerover", () => icon.setScale(1.1));
      icon.on("pointerout",  () => icon.setScale(1.0));

      // click to choose
      icon.once("pointerdown", () => {
        // apply the chosen reward
        this.onSelect(reward);

        // close this UI and resume the game
        this.scene.stop();
        this.scene.resume("Level");
      });
    });
  }
}