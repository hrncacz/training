import { canvas, ctx, gravity } from './main';

interface ISpriteProps {
  position: { x: number; y: number };
  offset?: { x: number; y: number };
  imageSource: string;
  scale: number;
  framesMax: number;
  fullSize?: boolean;
}

interface ISpritesSprite {
  imageSource: string;
  framesMax: number;
  image: HTMLImageElement;
}

interface IFighterProps extends ISpriteProps {
  velocity: { x: number; y: number };
  color: string;
  sprites: { [key: string]: ISpritesSprite };
  weaponBlock: {
    offset: { x: number; y: number };
    width: number;
    height: number;
  };
}

class Sprite {
  position: { x: number; y: number };
  offset: { x: number; y: number };
  width: number;
  height: number;
  image: HTMLImageElement;
  scale: number;
  framesMax: number;
  framesEllapsed: number;
  framesHold: number;
  frameCurrent: number;
  fullSize: boolean | undefined;

  constructor(props: ISpriteProps) {
    this.position = props.position;
    this.scale = props.scale;
    this.fullSize = props.fullSize;
    this.framesEllapsed = 0;
    this.framesHold = 5;
    this.frameCurrent = 0;
    this.framesMax = props.framesMax;
    this.image = new Image();
    this.image.src = props.imageSource;
    this.width = this.image.width;
    this.height = this.image.height;
    typeof props.offset === 'undefined'
      ? (this.offset = { x: 0, y: 0 })
      : (this.offset = props.offset);
  }

  _draw() {
    this.fullSize !== true
      ? ctx.drawImage(
          this.image,
          this.frameCurrent * (this.image.width / this.framesMax),
          0,
          this.image.width / this.framesMax,
          this.image.height,
          this.position.x - this.offset.x,
          this.position.y - this.offset.y,
          (this.image.width / this.framesMax) * this.scale,
          this.image.height * this.scale
        )
      : ctx.drawImage(
          this.image,
          this.position.x,
          this.position.y,
          canvas.width,
          canvas.height
        );
  }

  update() {
    this._draw();
    this.animateFrames();
  }

  animateFrames() {
    this.framesEllapsed++;
    if (this.framesEllapsed % this.framesHold === 0) {
      this.frameCurrent < this.framesMax - 1
        ? this.frameCurrent++
        : (this.frameCurrent = 0);
    }
  }
}

class Fighter extends Sprite {
  velocity: { x: number; y: number };
  color: string;
  lastKey: string;
  inAir: boolean;
  weaponBlock: {
    x: number;
    y: number;
    offset: { x: number; y: number };
    width: number;
    height: number;
    color: string;
  };
  isHitting: boolean;
  health: number;
  sprites: { [key: string]: ISpritesSprite };

  constructor(props: IFighterProps) {
    super(props);
    this.velocity = props.velocity;
    this.color = props.color;
    this.lastKey = '';
    this.inAir = false;
    this.weaponBlock = {
      x: props.position.x,
      y: props.position.y,
      offset: props.weaponBlock.offset,
      width: props.weaponBlock.width,
      height: props.weaponBlock.height,
      color: 'black',
    };
    this.isHitting = false;
    this.health = 100;
    this.framesEllapsed = 0;
    this.framesHold = 6;
    this.frameCurrent = 0;
    this.framesMax = props.framesMax;
    this.image = new Image();
    this.image.src = props.imageSource;
    this.sprites = props.sprites;

    for (const sprite in this.sprites) {
      props.sprites[sprite].image = new Image();
      props.sprites[sprite].image.src = props.sprites[sprite].imageSource;
    }
  }

  _drawWeapon() {
    ctx.fillStyle = this.weaponBlock.color;
    this.weaponBlock.x = this.position.x + this.weaponBlock.offset.x;
    this.weaponBlock.y = this.position.y + this.weaponBlock.offset.y;

    ctx.fillRect(
      this.weaponBlock.x,
      this.weaponBlock.y,
      this.weaponBlock.width,
      this.weaponBlock.height
    );
  }

  update() {
    this._draw();
    this._drawWeapon();

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this._drawWeapon();

    if (
      this.position.y + this.height + this.velocity.y >=
      canvas.height * 0.835
    ) {
      this.velocity.y = 0;
      this.inAir = false;
    } else {
      this.velocity.y += gravity;
    }
    this.animateFrames();
  }

  // _updateWeapon() {
  //   this.weaponBlock.x = this.position.x;
  //   this.weaponBlock.y = this.position.y;
  // }

  idleSprite() {
    if (
      this.image === this.sprites.attack1.image &&
      this.frameCurrent < this.sprites.attack1.framesMax - 1
    ) {
      return;
    }
    this.image = this.sprites.idle.image;
    this.framesMax = this.sprites.idle.framesMax;
  }

  runSprite() {
    this.image = this.sprites.run.image;
    this.framesMax = this.sprites.run.framesMax;
  }

  jumpSprite() {
    this.frameCurrent = 0;
    this.framesEllapsed = 0;
    this.image = this.sprites.jump.image;
    this.framesMax = this.sprites.jump.framesMax;
  }

  fallSprite() {
    this.frameCurrent = 0;
    this.framesEllapsed = 0;
    this.image = this.sprites.fall.image;
    this.framesMax = this.sprites.fall.framesMax;
  }

  attackSprite() {
    this.frameCurrent = 0;
    this.framesEllapsed = 0;
    this.image = this.sprites.attack1.image;
    this.framesMax = this.sprites.attack1.framesMax;
  }

  jump() {
    this.velocity.y = -22;
    this.inAir = true;
  }

  hit() {
    this.isHitting = true;
    this.attackSprite();
  }

  gotHit(amount: number) {
    this.health -= amount;
  }

  getHealth() {
    return this.health;
  }

  getBodyLeftSide() {
    return this.position.x;
  }
  getBodyRightSide() {
    return this.position.x + this.width / this.framesMax;
  }
  getBodyTopSide() {
    return this.position.y;
  }
  getBodyBottomSide() {
    return this.position.y + this.height;
  }

  getWeaponLeftSide() {
    return this.weaponBlock.x;
  }
  getWeaponRightSide() {
    return this.weaponBlock.x + this.weaponBlock.width;
  }
  getWeaponTopSide() {
    return this.weaponBlock.y;
  }
  getWeaponBottomSide() {
    return this.weaponBlock.y + this.weaponBlock.height;
  }

  successfulHit() {
    this.isHitting = false;
  }
}

export { Sprite, Fighter };
