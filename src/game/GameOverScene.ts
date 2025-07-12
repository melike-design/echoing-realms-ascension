
import Phaser from 'phaser';

interface GameData {
  score: number;
  level: number;
  lives: number;
}

export class GameOverScene extends Phaser.Scene {
  private gameData!: GameData;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: GameData) {
    this.gameData = data;
  }

  create() {
    // Oyun Bitti başlığı
    this.add.text(400, 150, '🎮 Oyun Bitti! 🎮', {
      fontSize: '48px',
      color: '#ff0000',
      fontFamily: 'Arial, sans-serif',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Skor gösterimi
    this.add.text(400, 250, 
      `Final Skorun: ${this.gameData.score}\n` +
      `Ulaştığın Seviye: ${this.gameData.level}\n\n` +
      `${this.gameData.score > 100 ? '🏆 Harika performans!' : 
        this.gameData.score > 50 ? '👍 İyi iş çıkardın!' : 
        '💪 Daha iyisini yapabilirsin!'}`, {
      fontSize: '24px',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif',
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Yeniden başlatma talimatı
    const restartText = this.add.text(400, 450, 'ENTER - Yeniden Oyna | ESC - Ana Menü', {
      fontSize: '20px',
      color: '#ffff00',
      fontFamily: 'Arial, sans-serif',
      stroke: '#000000',
      strokeThickness: 2
    }).setOrigin(0.5);

    // Yanıp sönme efekti
    this.tweens.add({
      targets: restartText,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    // Klavye kontrolleri
    this.input.keyboard?.once('keydown-ENTER', () => {
      this.scene.start('GameScene');
    });

    this.input.keyboard?.once('keydown-ESC', () => {
      this.scene.start('MenuScene');
    });

    // Yüksek skor kaydı (localStorage)
    this.saveHighScore();
  }

  private saveHighScore() {
    const currentHighScore = localStorage.getItem('pixelAdventureHighScore');
    const highScore = currentHighScore ? parseInt(currentHighScore) : 0;

    if (this.gameData.score > highScore) {
      localStorage.setItem('pixelAdventureHighScore', this.gameData.score.toString());
      
      // Yeni rekor mesajı
      this.add.text(400, 380, '🎉 YENİ REKOR! 🎉', {
        fontSize: '32px',
        color: '#00ff00',
        fontFamily: 'Arial, sans-serif',
        stroke: '#000000',
        strokeThickness: 3
      }).setOrigin(0.5);

      console.log('🏆 Yeni yüksek skor: ' + this.gameData.score);
    } else if (highScore > 0) {
      this.add.text(400, 380, `En Yüksek Skor: ${highScore}`, {
        fontSize: '18px',
        color: '#ffffff',
        fontFamily: 'Arial, sans-serif',
        stroke: '#000000',
        strokeThickness: 2
      }).setOrigin(0.5);
    }
  }
}
