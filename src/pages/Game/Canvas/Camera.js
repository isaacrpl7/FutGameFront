import Rectangle from "./Rectangle";

// possibles axis to move the camera
let AXIS = {
    NONE: 1,
    HORIZONTAL: 2,
    VERTICAL: 3,
    BOTH: 4
};

class Camera {
    constructor(xView, yView, viewportWidth, viewportHeight, worldWidth, worldHeight) {
        // position of camera (left-top coordinate)
        this.xView = xView || 0;
        this.yView = yView || 0;

        // distance from followed object to border before camera starts move
        this.xDeadZone = 0; // min distance to horizontal borders
        this.yDeadZone = 0; // min distance to vertical borders

        // viewport dimensions
        this.wView = viewportWidth;
        this.hView = viewportHeight;

        // allow camera to move in vertical and horizontal axis
        this.axis = AXIS.BOTH;

        // object that should be followed
        this.followed = null;

        // rectangle that represents the viewport
        this.viewportRect = new Rectangle(this.xView, this.yView, this.wView, this.hView);
        //console.log(this.xView, 'ONDE A CAMERA COMEÇA');

        // rectangle that represents the world's boundary (room's boundary)
        this.worldRect = new Rectangle(0-this.xView, 0, worldWidth, worldHeight);
    }

    follow(gameObject, xDeadZone, yDeadZone) {
        this.followed = gameObject;
        this.xDeadZone = xDeadZone;
        this.yDeadZone = yDeadZone;
    }

    update() {
        // keep following the player (or other desired object)
        if (this.followed != null) {
            if (this.axis == AXIS.HORIZONTAL || this.axis == AXIS.BOTH) {
                // moves camera on horizontal axis based on followed object position
                if (this.followed.x - this.xView + this.xDeadZone > this.wView) {
                    // this.xView = this.followed.x - (this.wView - this.xDeadZone);
                    this.xView += 1;
                    const interval = setInterval(() => {
                        this.xView += 1;
                    }, 1000);
                    const check = setInterval(() => {
                        if (this.xView >= this.followed.x - (this.wView - this.xDeadZone)) {
                            //console.log(this.xView, this.followed.x - (this.wView - this.xDeadZone));
                            clearInterval(interval);
                            clearInterval(check);
                        }
                    }, 1);
                } else if (this.followed.x - this.xDeadZone < this.xView) {
                    this.xView -= 1;
                    const interval = setInterval(() => {
                        this.xView -= 1;
                    }, 1000);
                    const check = setInterval(() => {
                        if (this.xView <= this.followed.x - this.xDeadZone) {
                            clearInterval(interval);
                            clearInterval(check);
                        }
                    }, 1);
                    // this.xView = this.followed.x - this.xDeadZone;
                }

            }
            if (this.axis == AXIS.VERTICAL || this.axis == AXIS.BOTH) {
                // moves camera on vertical axis based on followed object position
                if (this.followed.y - this.yView + this.yDeadZone > this.hView) {
                    //this.yView = this.followed.y - (this.hView - this.yDeadZone);
                    this.yView += 1;
                    const interval = setInterval(() => {
                        this.yView += 1;
                    }, 1000);
                    const check = setInterval(() => {
                        if (this.yView >= this.followed.y - (this.hView - this.yDeadZone)) {
                            //console.log(this.xView, this.followed.x - (this.wView - this.xDeadZone));
                            clearInterval(interval);
                            clearInterval(check);
                        }
                    }, 1);
                } else if (this.followed.y - this.yDeadZone < this.yView) {
                    // this.yView = this.followed.y - this.yDeadZone;
                    this.yView -= 1;
                    const interval = setInterval(() => {
                        this.yView -= 1;
                    }, 1000);
                    const check = setInterval(() => {
                        if (this.yView <= this.followed.y - this.yDeadZone) {
                            clearInterval(interval);
                            clearInterval(check);
                        }
                    }, 1);
                }
            }

        }

        // update viewportRect
        this.viewportRect.set(this.xView, this.yView);

        // don't let camera leaves the world's boundary
        if (!this.viewportRect.within(this.worldRect)) {
            if (this.viewportRect.left < this.worldRect.left)
                this.xView = this.worldRect.left;
            if (this.viewportRect.top < this.worldRect.top)
                this.yView = this.worldRect.top;
            if (this.viewportRect.right > this.worldRect.right)
                this.xView = this.worldRect.right - this.wView;
            if (this.viewportRect.bottom > this.worldRect.bottom)
                this.yView = this.worldRect.bottom - this.hView;
        }
    }
}

export default Camera;