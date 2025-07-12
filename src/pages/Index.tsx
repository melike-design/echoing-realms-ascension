
import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { GameScene } from '../game/GameScene';
import { MenuScene } from '../game/MenuScene';
import { GameOverScene } from '../game/GameOverScene';

const Index = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserGameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current || phaserGameRef.current) return;

    // Oyun yapılandırması
    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: 800,
      height: 600,
      parent: gameRef.current,
      backgroundColor: '#87CEEB',
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 800, x: 0 },
          debug: false
        }
      },
      scene: [MenuScene, GameScene, GameOverScene],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
          width: 400,
          height: 300
        },
        max: {
          width: 1200,
          height: 900
        }
      }
    };

    // Phaser oyununu başlat
    phaserGameRef.current = new Phaser.Game(config);

    // Temizlik fonksiyonu
    return () => {
      if (phaserGameRef.current) {
        phaserGameRef.current.destroy(true);
        phaserGameRef.current = null;
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          🌟 Pixel Adventure 🌟
        </h1>
        <p className="text-lg text-white/90 drop-shadow">
          Karakterini kontrol et, engelleri aş ve yüksek skor yap!
        </p>
      </div>
      
      {/* Oyun Alanı */}
      <div 
        ref={gameRef} 
        className="border-4 border-white rounded-lg shadow-2xl bg-black/20"
        style={{ maxWidth: '100%', maxHeight: '70vh' }}
      />
      
      {/* Kontroller Açıklaması */}
      <div className="mt-6 text-center">
        <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-white">
          <h3 className="font-bold mb-2">🎮 Kontroller:</h3>
          <p className="text-sm">← → Hareket | ↑ veya SPACE Zıplama | ENTER Başlat/Yeniden Başlat</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
