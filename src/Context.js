export default class Context {
    constructor(ctx, x, y){
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.paths = [];
    }

    _getPaths(){
        return this.paths.reverse();
    }

    // Drawing rectangles

    clearRect(x, y, width, height){
        let path = new Path2D();
        path.rect(this.x + x, this.y + y, width, height);
        this.ctx.clearRect(this.x + x, this.y + y, width, height);
        this.paths.push([false, path]);
    }

    fillRect(x, y, width, height){
        let path = new Path2D();
        path.rect(this.x + x, this.y + y, width, height);
        this.ctx.fill(path);
        this.paths.push([true, path]);
    }

    strokeRect(x, y, width, height, select = false){
        let path = new Path2D();
        path.rect(this.x + x, this.y + y, width, height);
        this.ctx.stroke(path);
        if(select){
            this.paths.push([true, path]);
        }
    }

    // Drawing text

    fillText(text, x, y, maxWidth = null){
        let mtext = this.ctx.measureText(text);
        this.ctx.fillText(text, x, y, maxWidth);
        let path = new Path2D();
        let width = mtext.width;
        if(maxWidth != undefined && maxWidth < width){
            width = maxWidth;
        }
        path.rect(x, y, width, mtext.height);
        this.paths.push([true, path]);
    }

    strokeText(text, x, y, maxWidth = null){
        let mtext = this.ctx.measureText(text);
        this.ctx.strokeText(text, x, y, maxWidth);
        let path = new Path2D();
        let width = mtext.width;
        if(maxWidth != undefined && maxWidth < width){
            width = maxWidth;
        }
        path.rect(x, y, width, mtext.height);
        this.paths.push([true, path]);
    }

    measureText(text){
        return this.measureText(text);
    }

    // Line styles

    getLineWidth(){
        return this.ctx.lineWidth;
    }

    setLineWidth(val){
        this.ctx.lineWidth = val;
    }

    getLineCap(){
        return this.ctx.lineCap;
    }

    setLineCap(val){
        this.ctx.lineCap = val;
    }

    getLineJoin(){
        return this.ctx.lineJoin;
    }

    setLineJoin(val){
        this.ctx.lineJoin = val;
    }

    getMiterLimit(){
        return this.ctx.miterLimit;
    }

    setMiterLimit(val){
        this.ctx.miterLimit = val;
    }

    getLineDash(){
        return this.ctx.getLineDash();
    }

    setLineDash(val){
        this.ctx.setLineDash(val);
    }

    getLineDashOffset(){
        return this.ctx.lineDashOffset;
    }

    setLineDashOffset(val){
        this.ctx.lineDashOffset = val;
    }

    // Text styles

    getFont(){
        return this.ctx.font;
    }

    setFont(val){
        this.ctx.font = val;
    }

    getTextAlign(){
        return this.ctx.textAlign;
    }

    setTextAlign(val){
        this.ctx.textAlign = val;
    }

    getTextBaseline(){
        return this.ctx.textBaseline;
    }

    setTextBaseline(val){
        this.ctx.textBaseline = val;
    }

    getDirection(){
        return this.ctx.direction;
    }

    setDirection(val){
        this.ctx.direction = val;
    }   

    // Fill and stroke styles

    getFillStyle(){
        return this.ctx.fillStyle;
    }

    setFillStyle(val){
        this.ctx.fillStyle = val;
    }

    getStrokeStyle(){
        return this.ctx.strokeStyle;
    }

    setStrokeStyle(val){
        this.ctx.strokeStyle = val;
    }

    // Gradients and patterns

    createLinearGradient(x0, y0, x1, y1){
        this.ctx.createLinearGradient(x0, y0, x1, y1);
    }

    createRadialGradient(x0, y0, r0, x1, y1, r1){
        this.ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    }

    createPattern(image, repetition){
        this.ctx.createPattern(image, repetition);
    }

    // Shadows

    getShadowBlur(){
        return this.ctx.shadowBlur;
    }

    setShadowBlur(val){
        this.ctx.shadowBlur = val;
    }

    getShadowColor(){
        return this.ctx.shadowColor;
    }

    setShadowColor(val){
        this.ctx.shadowColor = val;
    }

    getShadowOffsetX(){
        return this.ctx.shadowOffsetX;
    }

    setShadowOffsetX(val){
        this.ctx.shadowOffsetX = val;
    }

    getShadowOffsetY(){
        return this.ctx.shadowOffsetY;
    }

    setShadowOffsetY(val){
        this.ctx.shadowOffsetY = val;
    }

    // Paths

    // https://github.com/google/canvas-5-polyfill

    // With this polyfill installed, the calls to context.clip(path), 
    // context.isPointInPath(path, x, y) and context.isPointInStroke(path, x, y) 
    // all affect the current path.

    // When using the polyfill the best approach is to move strictly to using 
    // Path2D objects to describe paths and then use the path enabled calls on 
    // the context, such as ctx.fill(path). Do not mix and match such calls.

    // Drawing paths

    fill(path, fillRule){
        this.ctx.fill(path, fillRule);
        this.paths.push([true, path]);
    }

    stroke(path){
        this.ctx.stroke(path);
        this.paths.push([true, path]);
    }

    drawFocusIfNeeded(arg1, arg2){
        this.ctx.drawFocusIfNeeded(arg1, arg2);
    }

    scrollPathIntoView(path){
        this.ctx.scrollPathIntoView(path);
    }

    clip(path, fillRule){
        throw 'Not implemented';
    }

    isPointInPath(path, x, y, fillRule){
        this.ctx.isPointInPath(path, x, y, fillRule);
    }

    isPointInStroke(path, x, y){
        this.ctx.isPointInStroke(path, x, y);
    }

}