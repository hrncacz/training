import Tower from '.';

class Player {
  game: Tower;
  x: number;
  y: number;
  prevY: number;
  width: number;
  height: number;
  gravity: number;
  velocity: { x: number; y: number };
  image: HTMLImageElement | null;
  scale: number;
  offset: { x: number; y: number };
  direction: number;

  constructor(
    game: Tower,
    x: number,
    y: number,
    width: number,
    height: number,
    image: HTMLImageElement | null
  ) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.prevY = this.y;
    this.width = width;
    this.height = height;
    this.velocity = { x: 0, y: 0 };
    this.gravity = 0.7;
    this.image = image;
    this.scale = 3;
    this.offset = { x: 50, y: 50 };
    this.direction = 1;

    if (this.image !== null) {
      this.width = this.image.width * this.scale;
      this.height = this.image.height * this.scale;
    }
  }

  draw() {
    if (this.image === null) {
      this.game.ctx.fillStyle = 'green';
      this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
    } else {
      this.game.ctx.drawImage(
        this.image,
        this.x,
        this.y,
        this.width,
        this.width
      );
    }
  }

  update() {
    this.draw();
    this.prevY = this.y;
    this.y += this.velocity.y;
    this.x += this.velocity.x;

    //Vertical movement
    if (this.y <= this.game.height - this.height - this.velocity.y) {
      this.velocity.y += this.gravity;
    } else {
      this.velocity.y = 0;
    }
    this.checkCollisions();

    if (this.game.pressed.ArrowUp && this.velocity.y === 0) {
      this.velocity.y = -30;
    }

    // Horizontal movement
    if (this.game.pressed.ArrowLeft && this.x > 0) {
      this.velocity.x = -7;
    } else if (
      this.game.pressed.ArrowRight &&
      this.x < this.game.width - this.width
    ) {
      this.velocity.x = 7;
    } else {
      this.velocity.x = 0;
    }
  }

  checkCollisions() {
    const platform = this.game.platform;
    if (
      this.getRightEdge() > platform.getLeftEdge() &&
      this.getLeftEdge() < platform.getRightEdge() &&
      this.getBottomEdge() >= platform.getTopEdge() &&
      this.prevY + this.height <= platform.prevY
    ) {
      this.y = platform.y - this.height;
      this.velocity.y = 0;
    }
  }

  getLeftEdge() {
    return this.x;
  }

  getRightEdge() {
    return this.x + this.width;
  }

  getTopEdge() {
    return this.y;
  }

  getBottomEdge() {
    return this.y + this.height;
  }
}

export default Player;
