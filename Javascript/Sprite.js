class Sprite {
  constructor(posX, posY, speedX, speedY, width, height, url) {
    this.x = posX;
    this.y = posY;
    this.speedX = speedX;
    this.speedY = speedY;
    this.width = width;
    this.height = height;
    this.rotation = 0;
    this.url = url;
    this.image = new Image();
    this.alive = true;
    if (typeof url != "undefined") {
      this.image.src = url;
    } else {
      console.warn("geen url opgegeven");
    }
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    ctx.rotate((Math.PI / 180) * this.rotation);
    ctx.drawImage(
      this.image,
      -this.width / 2,
      -this.height / 2,
      this.width,
      this.height
    );
    ctx.restore();
  }
}
