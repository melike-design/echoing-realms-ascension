
import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  private startText!: Phaser.GameObjects.Text;
  private titleText!: Phaser.GameObjects.Text;
  private instructionText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    // Başlık
    this.titleText = this.add.text(400, 150, '🌟 Pixel Adventure 🌟', {
      fontSize: '48px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Talimatlar
    this.instructionText = this.add.text(400, 250, 
      'Karakterini hareket ettir ve engelleri aş!\n\n' +
      '← → Hareket\n' +
      '↑ veya SPACE Zıplama\n\n' +
      'Yıldızları topla ve yüksek skor yap!', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Başlatma metni
    this.startText = this.add.text(400, 450, 'ENTER tuşuna basarak başla!', {
      fontSize: '24px',
      color: '#ffff00',
      fontFamily: 'Arial, sans-serif',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5);

    // Yanıp sönme efekti
    this.tweens.add({
      targets: this.startText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Klavye kontrolü
    this.input.keyboard?.once('keydown-ENTER', () => {
      this.scene.start('GameScene');
    });
  }
}
