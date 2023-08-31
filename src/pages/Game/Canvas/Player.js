class Player {
    constructor(x, y) {
        // (x, y) = center of object
        // ATTENTION:
        // it represents the player position on the world(room), not the canvas position
        this.x = x;
        this.y = y;

        // move speed in pixels per second
        this.maxSpeed = 200;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.acceleration = 300;
        this.desacceleration = 200;

        // render properties
        this.radius = 30;
    }

    update(step, worldWidth, worldHeight, controls, context) {
        // parameter step is the time between frames ( in seconds )

        if(this.xSpeed > 0){
            this.xSpeed = Math.min(this.xSpeed, this.maxSpeed); // Apenas configurando uma velocidade máxima
        } else {
            this.xSpeed = Math.max(this.xSpeed, this.maxSpeed * (-1));
        }
        this.x += this.xSpeed * step;

        if(this.ySpeed > 0){
            this.ySpeed = Math.min(this.ySpeed, this.maxSpeed);
        } else {
            this.ySpeed = Math.max(this.ySpeed, this.maxSpeed * (-1));
        }
        this.y += this.ySpeed * step;

        // check controls and move the player accordingly
        if (controls.left){
            if(this.xSpeed > 0) {
                this.xSpeed = 0;
            } else {
                this.xSpeed -= this.acceleration * step;
            }
        }
        if (controls.up){
            if(this.ySpeed > 0) {
                this.ySpeed = 0;
            } else {
                this.ySpeed -= this.acceleration * step;
            }
        }
        if (controls.right){
            if(this.xSpeed < 0) {
                this.xSpeed = 0;
            } else {
                this.xSpeed += this.acceleration * step;
            }
        } 
        if (controls.down){
            if(this.ySpeed < 0) {
                this.ySpeed = 0;
            } else {
                this.ySpeed += this.acceleration * step;
            }
        }
        
        // Código para quando o player parar de se mover desacelerar
        let desacceleration = this.desacceleration * step;
        if(!controls.down && !controls.up) {
            // está parado para eixo Y
            if(this.ySpeed > 0) {
                if(this.ySpeed - desacceleration < 0) this.ySpeed = 0;
                this.ySpeed -= desacceleration;
            }
            if(this.ySpeed < 0){
                if(this.ySpeed + desacceleration > 0) this.ySpeed = 0;
                this.ySpeed += desacceleration;
            }
        }
        if(!controls.right && !controls.left) {
            // está parado para eixo X
            if(this.xSpeed > 0) {
                if(this.xSpeed - desacceleration < 0) this.xSpeed = 0;
                this.xSpeed -= desacceleration;
            }
            if(this.xSpeed < 0){
                if(this.xSpeed + desacceleration > 0) this.xSpeed = 0;
                this.xSpeed += desacceleration;
            }
        }

        // don't let player leaves the world's boundary
        if (this.x - (this.radius*2) < 0) {
            this.x = (this.radius*2);
        }
        if (this.y - (this.radius*2) < 0) {
            this.y = (this.radius*2);
        }
        if (this.x + (this.radius*2) / 2 > worldWidth) {
            this.x = worldWidth - (this.radius*2) / 2;
        }
        if (this.y + (this.radius*2) / 2 > worldHeight) {
            this.y = worldHeight - (this.radius*2) / 2;
        }
    }

    draw(context, xView, yView) {
        // draw a simple rectangle shape as our player model
        context.save();
        context.beginPath();
        // before draw we need to convert player world's position to canvas position			
        context.arc((this.x - this.radius / 2) - xView, (this.y - this.radius / 2) - yView, this.radius, 0, 34);
        context.fillStyle = "#478ced";
        context.fill();
        context.lineWidth = 4;
        context.strokeStyle = 'black';
        context.stroke();
        //context.fillRect((this.x - this.width / 2) - xView, (this.y - this.height / 2) - yView, this.width, this.height);
        context.restore();
    }
}

export default Player;