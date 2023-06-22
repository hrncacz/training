import Player from './Player';
import Platform from './Platform';
import { IAssets } from './AssetsLoader';

class Tower {
  container: HTMLElement;
  assets: IAssets;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  rafId: number | null;
  player: Player;
  platform: Platform;
  pressed: { [key: string]: boolean };
  // assets: { [key: string]: HTMLImageElement };
  onKeyUp: (e: KeyboardEvent) => void;
  onKeyDown: (e: KeyboardEvent) => void;

  constructor(container: HTMLDivElement) {
    this.rafId = null;

    this.container = container;

    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    Object.assign(this.canvas.style, {
      zIndex: 20,
      width: this.width + 'px',
      height: this.height + 'px',
      position: 'absolute',
      left: 0,
      top: 0,
    });

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    container.appendChild(this.canvas);

    this.assets = {};

    this.player = new Player(
      this,
      this.width / 2,
      this.height / 5,
      100,
      100,
      null
    );
    this.platform = new Platform(
      this,
      this.width / 3,
      this.height / 2,
      200,
      50
    );

    this.pressed = {};
    this.onKeyDown = (e) => {
      Object.assign(this.pressed, {
        [e.key]: true,
      });
    };

    this.onKeyUp = (e) => {
      delete this.pressed[e.key];
    };

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);
  }

  assetsAssign(assets: IAssets) {
    this.assets = assets;
    this.setBackground();
    this.setPlayer();
  }

  setBackground() {
    const background = document.createElement('div');

    Object.assign(background.style, {
      position: 'absolute',
      zIndex: 10,
      left: 0,
      right: 0,
      width: this.width + 'px',
      height: this.height + 'px',
      backgroundImage: `url(${this.assets.background.src})`,
      backgroundSize: 'cover',
      backgrondRepeat: 'no-repeat',
      backgroundPosition: 'bottom',
    });

    this.container.appendChild(background);
  }

  setPlayer() {
    this.player = new Player(
      this,
      this.width / 2,
      this.height / 5,
      100,
      100,
      this.assets.player
    );
  }

  run() {
    this.rafId = requestAnimationFrame(this.step);
  }

  step = (frameTime: number) => {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.rafId = requestAnimationFrame(this.step);

    this.player.update();
    this.platform.update();
  };

  clear() {
    this.container.innerHTML = '';

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }

    window.removeEventListener('keydown', this.clear);
    window.removeEventListener('keyup', this.clear);
  }
}

export default Tower;
