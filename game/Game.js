"use strict";

class Game {
    constructor(canvasElement) {
        Game.instance = this;
        this.canvas = canvasElement;
        this.width = 256;
        this.height = 64;
        this.blockWidth = 32;
        this.blockHeight = 32;
        this.blocks = [];
        this.createWorld();
        this.ctx = this.canvas.getContext("2d");
        this.timestamp = 0;
        this.imageFiles = [
            ["sky", "game/images/sky.png"],
            ["player", "game/images/player.png"],
            ["dirt", "game/images/tiles/dirt.png"]
        ];
        this.images = {};
        this.player = {
            x: 128 * this.blockWidth,
            y: this.blockHeight,
        };
        this.fallSpeed = this.blockHeight / 1.5;
        this.loadImages();
    }

    loadImages() {
        let loadedImages = 0;
        this.imageFiles.forEach((src) => {
            let image = new Image();
            image.onload = () => {
                loadedImages++;
                if (loadedImages == this.imageFiles.length) {
                    this.start();
                }
            };
            image.src = src[1];
            this.images[src[0]] = image;
        });
    }

    start() {
        window.requestAnimationFrame(this.animationFrame.bind(this));
    }

    animationFrame(timestamp) {
        this.timestamp = timestamp;
        window.requestAnimationFrame(this.animationFrame.bind(this));
        this.update();
        this.ctx.save();
        this.ctx.drawImage(this.images.sky, 0, 0);
        this.centerOnPlayer();
        this.drawBlocks();
        this.drawPlayer();
        this.ctx.fillText(timestamp, 20, 20);
        this.ctx.restore();
    }

    update() {
        // Update player height
        if (this.getBlock(this.playerBlockX(), this.playerBlockY()).empty
         && this.player.y < (this.playerBlockY() + 1) * this.blockHeight) {
            this.player.y += this.fallSpeed;
        } else if (this.getBlock(this.playerBlockX(), this.playerBlockY() + 1). empty) {
            this.player.y += this.fallSpeed;
        }

        if (this.player.y > (this.playerBlockY() + 1) * this.blockHeight) {
            this.player.y = (this.playerBlockY() + 1) * this.blockHeight;
        }

        console.log(this.player.x, this.player.y, this.playerBlockX() * this.blockWidth, this.playerBlockY() * this.blockHeight);

        /*if (this.blocks[this.playerBlockX()][this.playerBlockY()].empty) {
            this.player.y += this.fallSpeed;
        } else if (this.player.y > (this.playerBlockY() - 1) * this.blockHeight) {
            this.player.y = this.playerBlockY() * this.blockHeight;
        }*/
    }
    centerOnPlayer() {
        let x = -this.player.x + this.canvas.width / 2 - this.blockWidth / 2;
        let y = -this.player.y + this.canvas.height / 2;
        this.ctx.translate(x, y);
    }

    drawBlocks() {
        this.ctx.strokeStyle = "yellow";
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                if (!this.blocks[x][y].empty) {
                    this.ctx.drawImage(
                        this.images[this.blocks[x][y].type],
                        x * this.blockWidth,
                        y * this.blockHeight,
                        this.blockWidth,
                        this.blockHeight 
                    );
                }
                this.ctx.strokeRect(
                    x * this.blockWidth, 
                    y * this.blockHeight,
                    this.blockWidth,
                    this.blockHeight 
                );
            }
        }
    }

    drawPlayer() {
        this.ctx.drawImage(
            this.images.player,
            this.player.x,
            this.player.y - 2 * this.blockHeight
        );

        this.ctx.strokeStyle = "red";
        this.ctx.strokeRect(
            this.playerBlockX() * this.blockWidth, 
            this.playerBlockY() * this.blockHeight, 
            this.blockWidth, 
            this.blockHeight
        );
        this.ctx.strokeStyle = "green";
        this.ctx.strokeRect(
            this.player.x, 
            this.player.y,
            this.blockWidth,
            2
        );
    }

    createWorld() {
        for (let x = 0; x < this.width; x++) {
            this.blocks[x] = [];
            for (let y = 0; y < this.height; y++) {
                //if ()
                this.blocks[x][y] = {
                    empty: y < this.random(28, 34) ? true : false,
                    type: "dirt"
                };
            }
        }
    }

    playerBlockX() {
        return Math.round(this.player.x / this.blockWidth);
    }

    playerBlockY() {
        return Math.round(this.player.y / this.blockHeight) - 1;
    }

    random(min, max) {
        if (max === undefined) {
            if (min === undefined) {
                return Math.random();
            }
            max = min;
            min = 0;
        }
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    getBlock(x, y) {
        if (this.blocks[x][y] !== undefined) {
            return this.blocks[x][y];
        }
        return { x, y, empty: true};
    }
}
