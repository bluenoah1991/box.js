export default class Box{
    constructor(width, height, render){
        this.width = width;
        this.height = height;
        this.render = render;
        this.mount = false;
    }

    setPosition(x, y){
        this.x = x;
        this.y = y;
        let path = new Path2D();
        path.rect(x, y, this.width, this.height);
        this.path = path;
    }
}