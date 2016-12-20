import _ from 'lodash';

export default class Path{
    constructor(ctx){
        this.ctx = ctx;
        this.x = ctx.x;
        this.y = ctx.y;
        this.zoom = ctx.zoom;
        this.nativePath = new Path2D();
    }

    _zoom(){
        return _.map(arguments, function(val){
            return val * this.zoom;
        }.bind(this));
    }

    addPath(path, transform){
        this.nativePath.addPath(path.nativePath, transform);
    }

    closePath(){
        this.nativePath.closePath();
    }

    moveTo(x, y){
        [x, y] = this._zoom(x, y);
        this.nativePath.moveTo(this.x + x, this.y + y);
    }

    lineTo(x, y){
        [x, y] = this._zoom(x, y);
        this.nativePath.lineTo(this.x + x, this.y + y);
    }

    bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y){
        [cp1x, cp1y, cp2x, cp2y, x, y] = this._zoom(cp1x, cp1y, cp2x, cp2y, x, y);
        this.nativePath.bezierCurveTo(
            this.x + cp1x, this.y + cp1y, this.x + cp2x, 
            this.y + cp2y, this.x + x, this.y + y);
    }

    quadraticCurveTo(cpx, cpy, x, y){
        [cpx, cpy, x, y] = this._zoom(cpx, cpy, x, y);
        this.nativePath.quadraticCurveTo(
            this.x + cpx, this.y + cpy, this.x + x, this.y + y);
    }

    arc(x, y, radius, startAngle, endAngle, anticlockwise){
        [x, y, radius] = this._zoom(x, y, radius);
        this.nativePath.arc(this.x + x, this.y + y, 
        radius, startAngle, endAngle, anticlockwise);
    }

    arcTo(x1, y1, x2, y2, radius){
        [x1, y1, x2, y2, radius] = this._zoom(x1, y1, x2, y2, radius);
        this.nativePath.arcTo(
            this.x + x1, this.y + y1, this.x + x2, this.y + y2, radius);
    }

    ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise){
        [x, y, radiusX, radiusY] = this._zoom(x, y, radiusX, radiusY);
        this.nativePath.ellipse(
            this.x + x, this.y + y, radiusX, radiusY, 
            rotation, startAngle, endAngle, anticlockwise);
    }

    rect(x, y, width, height){
        [x, y, width, height] = this._zoom(x, y, width, height);
        this.nativePath.rect(this.x + x, this.y + y, width, height);
    }
}