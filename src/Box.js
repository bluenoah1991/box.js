export default class Box{
    constructor(render){
        this.render = render;
        this.mount = false;
        this.scene = null;
        this.paths = [];
    }

    _include(x, y){
        if(this.mount){
            for(var i in this.paths){
                let [include, path] = this.paths[i];
                if(this.scene.ctx.isPointInPath(path, x, y)){
                    return include;
                }
            }
        } else {
            return false;
        }
    }

    setPosition(x, y){
        this.x = x;
        this.y = y;
    }
}