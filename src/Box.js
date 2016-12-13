import _ from 'lodash';

export default class Box{
    constructor(renderOrElement){
        if(typeof renderOrElement == 'function'){
            this.isElement = false;
            this.render = renderOrElement;
        } else {
            this.isElement = true;
            this.element = renderOrElement;
        }
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
        if(this.isElement && this.mount){
            this.element.css('left', this.x + this.scene.canvas.offsetLeft);
            this.element.css('top', this.y + this.scene.canvas.offsetTop);
        }
    }

    // events

    onMouseUp(e, x, y){
        // override it
    }

    onMouseDown(e, x, y){
        // override it
    }

    onMouseOver(e, x, y){
        // override it
    }

    onMouseOut(e, x, y){
        // override it
    }

}