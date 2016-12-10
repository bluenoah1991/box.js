export default class Context {
    constructor(ctx, x, y){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
    }

    getFillStyle(){
        return this.ctx.fillStyle;
    }

    setFillStyle(val){
        this.ctx.fillStyle = val;
    }

    fillRect(x, y, width, height){
        this.ctx.fillRect(this.x + x, this.y + y, width, height);
    }
}