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
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.offsetX = 0;
        this.offsetY = 0;
        this.show_ = true;
    }

    _include(x, y){
        if(!this.show_){
            return false;
        }
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

    _removePosition(){
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }

    setPosition(x, y, z = 0){
        this.x = x;
        this.y = y;
        this.z = z;
        if(this.mount){
            [this.offsetX, this.offsetY] = this.scene._reverseOffset(x, y);
        }
    }

    setAbsPosition(realX, realY, z = 0){
        if(this.mount){
            [this.x, this.y] = this.scene._reversePos(realX, realY);
            [this.offsetX, this.offsetY] = [realX - this.x, realY - this.y];
        } else {
            this.x = x;
            this.y = y;
        }
        this.z = z;
    }

    absX(){
        return this.x + this.offsetX;
    }

    absY(){
        return this.y + this.offsetY;
    }

    show(){
        this.show_ = true;
        if(this.mount){
            this.scene.render();
        }
    }

    hide(){
        this.show_ = false;
        if(this.mount){
            this.scene.render();
        }
    }

    // if isElement = true

    elementWidth(){
        if(this.isElement){
            let zoom = 1;
            if(this.mount){
                zoom = this.scene.zoom;
            }
            return parseInt(this.element.css('width')) / this.scene.zoom;
        } else {
            return -1;
        }
    }

    elementHeight(){
        if(this.isElement){
            let zoom = 1;
            if(this.mount){
                zoom = this.scene.zoom;
            }
            return parseInt(this.element.css('height')) / this.scene.zoom;
        } else {
            return -1;
        }
    }

    elementMarginTop(){
        if(this.isElement){
            let zoom = 1;
            if(this.mount){
                zoom = this.scene.zoom;
            }
            return parseInt(this.element.css('margin-top')) / this.scene.zoom;
        } else {
            return -1;
        }
    }

    elementMarginRight(){
        if(this.isElement){
            let zoom = 1;
            if(this.mount){
                zoom = this.scene.zoom;
            }
            return parseInt(this.element.css('margin-right')) / this.scene.zoom;
        } else {
            return -1;
        }
    }

    elementMarginBottom(){
        if(this.isElement){
            let zoom = 1;
            if(this.mount){
                zoom = this.scene.zoom;
            }
            return parseInt(this.element.css('margin-bottom')) / this.scene.zoom;
        } else {
            return -1;
        }
    }

    elementMarginLeft(){
        if(this.isElement){
            let zoom = 1;
            if(this.mount){
                zoom = this.scene.zoom;
            }
            return parseInt(this.element.css('margin-left')) / this.scene.zoom;
        } else {
            return -1;
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

    // touch events

    onTouchStart(e, x, y){
        // override it
    }

    onTouchEnd(e, x, y){
        // override it
    }

    onTouchEnter(e, x, y){
        // override it
    }

    onTouchLeave(e, x, y){
        // override it
    }

}