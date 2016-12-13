export default class Path{
    constructor(ctx){
        this.ctx = ctx;
        this.x = ctx.x;
        this.y = ctx.y;
        this.nativePath = new Path2D();
    }

    addPath(path, transform){
        this.nativePath.addPath(path.nativePath, transform);
    }

    closePath(){
        this.nativePath.closePath();
    }

    moveTo(x, y){
        this.nativePath.moveTo(this.x + x, this.y + y);
    }

    lineTo(x, y){
        this.nativePath.lineTo(this.x + x, this.y + y);
    }

    bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y){
        this.nativePath.bezierCurveTo(
            this.x + cp1x, this.y + cp1y, this.x + cp2x, 
            this.y + cp2y, this.x + x, this.y + y);
    }

    quadraticCurveTo(cpx, cpy, x, y){
        this.nativePath.quadraticCurveTo(
            this.x + cpx, this.y + cpy, this.x + x, this.y + y);
    }

    arc(x, y, radius, startAngle, endAngle, anticlockwise){
        this.nativePath.arc(this.x + x, this.y + y, 
        radius, startAngle, endAngle, anticlockwise);
    }

    arcTo(x1, y1, x2, y2, radius){
        this.nativePath.arcTo(
            this.x + x1, this.y + y1, this.x + x2, this.y + y2, radius);
    }

    ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise){
        this.nativePath.ellipse(
            this.x + x, this.y + y, radiusX, radiusY, 
            rotation, startAngle, endAngle, anticlockwise);
    }

    rect(x, y, width, height){
        this.nativePath.rect(this.x + x, this.y + y, width, height);
    }
}