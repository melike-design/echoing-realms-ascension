
import Phaser from 'phaser';

interface GameData {
  score: number;
  level: number;
  lives: number;
}

export class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private enemies!: Phaser.Physics.Arcade.Group;
  private stars!: Phaser.Physics.Arcade.Group;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  
  private score: number = 0;
  private level: number = 1;
  private lives: number = 3;
  
  private scoreText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  
  private gameData: GameData = { score: 0, level: 1, lives: 3 };

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Basit renkli dikdörtgenler oluştur (gerçek sprite'lar yerine)
    this.load.image('ground', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==');
    
    // Oyuncu için basit kare sprite oluştur
    this.createColoredSprite('player', '#4CAF50', 32, 48);
    this.createColoredSprite('enemy', '#F44336', 32, 32);
    this.createColoredSprite('star', '#FFD700', 24, 24);
    this.createColoredSprite('platform', '#8B4513', 400, 32);
  }

  create() {
    // Platformları oluştur
    this.platforms = this.physics.add.staticGroup();
    
    // Zemin
    this.platforms.create(400, 568, 'platform').setScale(2, 1).refreshBody();
    
    // Diğer platformlar
    this.platforms.create(600, 400, 'platform').setScale(0.5, 1).refreshBody();
    this.platforms.create(50, 250, 'platform').setScale(0.5, 1).refreshBody();
    this.platforms.create(750, 220, 'platform').setScale(0.5, 1).refreshBody();

    // Oyuncu karakteri
    this.player = this.physics.add.sprite(100, 450, 'player');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.setTint(0x4CAF50);

    // Oyuncu animasyonları (basit renk değişimi)
    this.anims.create({
      key: 'left',
      frames: [{ key: 'player' }],
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: 'turn',
      frames: [{ key: 'player' }],
      frameRate: 20
    });
    
    this.anims.create({
      key: 'right',
      frames: [{ key: 'player' }],
      frameRate: 10,
      repeat: -1
    });

    // Fizik çarpışmaları
    this.physics.add.collider(this.player, this.platforms);

    // Kontroller
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.spaceKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    // Yıldızlar grubu
    this.stars = this.physics.add.group({
      key: 'star',
      repeat: 11,
      setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.stars.children.entries.forEach((child) => {
      const star = child as Phaser.Physics.Arcade.Sprite;
      star.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      star.setTint(0xFFD700);
    });

    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);

    // Düşmanlar
    this.enemies = this.physics.add.group();
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, undefined, this);

    // UI Metinleri
    this.scoreText = this.add.text(16, 16, 'Skor: 0', {
      fontSize: '24px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    });
    
    this.levelText = this.add.text(16, 50, 'Seviye: 1', {
      fontSize: '20px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    });
    
    this.livesText = this.add.text(16, 80, 'Can: 3', {
      fontSize: '20px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    });

    // İlk düşmanları yerleştir
    this.spawnEnemies();
  }

  update() {
    // Oyuncu kontrolü
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('left', true);
      this.player.setTint(0x4CAF50);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('right', true);
      this.player.setTint(0x4CAF50);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('turn');
      this.player.setTint(0x4CAF50);
    }

    // Zıplama
    if ((this.cursors.up.isDown || this.spaceKey.isDown) && this.player.body!.touching.down) {
      this.player.setVelocityY(-500);
    }

    // Düşman hareketi
    this.enemies.children.entries.forEach((enemy) => {
      const enemySprite = enemy as Phaser.Physics.Arcade.Sprite;
      if (enemySprite.body!.velocity.x === 0) {
        enemySprite.setVelocityX(Phaser.Math.Between(-100, 100));
      }
    });
  }

  private createColoredSprite(key: string, color: string, width: number, height: number) {
    this.add.graphics()
      .fillStyle(Phaser.Display.Color.HexStringToColor(color).color)
      .fillRect(0, 0, width, height)
      .generateTexture(key, width, height);
  }

  private collectStar(player: Phaser.GameObjects.GameObject, star: Phaser.GameObjects.GameObject) {
    const starSprite = star as Phaser.Physics.Arcade.Sprite;
    starSprite.disableBody(true, true);

    this.score += 10;
    this.scoreText.setText('Skor: ' + this.score);

    // Ses efekti simülasyonu (console log)
    console.log('⭐ Yıldız toplandı! Skor: ' + this.score);

    // Tüm yıldızlar toplandıysa yeni seviye
    if (this.stars.countActive(true) === 0) {
      this.nextLevel();
    }
  }

  private hitEnemy(player: Phaser.GameObjects.GameObject, enemy: Phaser.GameObjects.GameObject) {
    const enemySprite = enemy as Phaser.Physics.Arcade.Sprite;
    enemySprite.disableBody(true, true);
    
    this.lives--;
    this.livesText.setText('Can: ' + this.lives);

    // Oyuncu yanıp sönme efekti
    this.tweens.add({
      targets: this.player,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 5
    });

    console.log('💥 Düşmana çarptın! Kalan can: ' + this.lives);

    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  private spawnEnemies() {
    // Seviyeye göre düşman sayısı
    const enemyCount = Math.floor(this.level / 2) + 1;
    
    for (let i = 0; i < enemyCount; i++) {
      const x = Phaser.Math.Between(100, 700);
      const enemy = this.enemies.create(x, 16, 'enemy');
      enemy.setBounce(1);
      enemy.setCollideWorldBounds(true);
      enemy.setVelocity(Phaser.Math.Between(-200, 200), 20);
      enemy.setTint(0xF44336);
    }
  }

  private nextLevel() {
    this.level++;
    this.levelText.setText('Seviye: ' + this.level);

    // Yeni yıldızlar
    this.stars.children.entries.forEach((child) => {
      const star = child as Phaser.Physics.Arcade.Sprite;
      star.enableBody(true, star.x, 0, true, true);
    });

    // Yeni düşmanlar
    this.spawnEnemies();

    console.log('🎉 Seviye tamamlandı! Yeni seviye: ' + this.level);
  }

  private gameOver() {
    this.gameData = {
      score: this.score,
      level: this.level,
      lives: 0
    };

    this.scene.start('GameOverScene', this.gameData);
  }
}
