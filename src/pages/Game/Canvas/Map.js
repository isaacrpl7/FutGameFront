import map from './map.png';

class Map {
    constructor(width, height) {
        // map dimensions
        this.width = width;
        this.height = height;

        // map texture
        this.image = null;
    }

    // creates a prodedural generated map (you can use an image instead)
    generate() {
        var ctx = document.createElement("canvas").getContext("2d");
        ctx.canvas.width = this.width;
        ctx.canvas.height = this.height;

        var rows = ~~(this.width / 44) + 1;
        var columns = ~~(this.height / 44) + 1;

        var color = "#c7c7c7";
        ctx.save();
        ctx.fillStyle = "#c7c7c7";
        for (var x = 0, i = 0; i < rows; x += 44, i++) {
            ctx.beginPath();
            for (var y = 0, j = 0; j < columns; y += 44, j++) {
                ctx.rect(x, y, 40, 40);
            }
            color = (color === "#c7c7c7" ? "#e8e8e8" : "#c7c7c7");
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();
        }
        ctx.restore();

        // store the generate map as this image texture
        this.image = new Image();
        //this.image.src = ctx.canvas.toDataURL("image/png");
        this.image.src = map;
        // clear context
        ctx = null;
    }

    // draw the map adjusted to camera
    draw(context, xView, yView) {
        // easiest way: draw the entire map changing only the destination coordinate in canvas
        // canvas will cull the image by itself (no performance gaps -> in hardware accelerated environments, at least)
        /*context.drawImage(this.image, 0, 0, this.image.width, this.image.height, -xView, -yView, this.image.width, this.image.height);*/

        // didactic way ( "s" is for "source" and "d" is for "destination" in the variable names):

        var sx, sy, dx, dy;
        var sWidth, sHeight, dWidth, dHeight;

        // Onde a imagem original será cortada
        // Aqui ele não irá deixar a imagem original intacta e apenas ajustar a margem dela no canvas (o dx ou dy)
        // Ele vai na vdd deixar a margem intacta e mudar o sx / sy para ser maior que a imagem, criando um "padding"
        sx = xView; //está sendo cortada onde inicia a camera
        sy = yView;

        // Os tamanhos da imagem original cortada (será do tamanho do canvas)
        sWidth = context.canvas.width;
        sHeight = context.canvas.height;

        // location on canvas to draw the croped image
        dx = 0;
        dy = 0;

        // se o tamanho da imagem for menor que o canvas
        if (this.image.width - sx < sWidth) {
            sWidth = this.image.width - sx;
        }
        if (this.image.height - sy < sHeight) {
            sHeight = this.image.height - sy;
        }

        // match destination with source to not scale the image
        dWidth = sWidth;
        dHeight = sHeight;

        context.fillStyle = 'grey';
        context.fillRect(0, 0, context.canvas.width, context.canvas.height);
        //console.log(sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight, 'sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight');
        context.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    }
}

export default Map;