import Tower from '.';

class Platfrom {
  game: Tower;
  x: number;
  y: number;
  prevY: number;
  width: number;
  height: number;
  velocity: number;

  constructor(
    game: Tower,
    x: number,
    y: number,

    width: number,
    height: number
  ) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity = 10;
    this.prevY = this.y;
  }

  draw() {
    this.game.ctx.fillStyle = 'red';
    this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.prevY = this.y;
    this.draw();
    if (this.x + this.width >= this.game.width || this.x <= 0) {
      this.velocity *= -1;
    }

    this.x += this.velocity;
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

export default Platfrom;
