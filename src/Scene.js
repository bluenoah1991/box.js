import _ from 'lodash';
import uuid from 'node-uuid';

import Context from './Context';

export default class Scene{
    constructor(id){
        this.canvas = document.getElementById(id);
        this.ctx = this.canvas.getContext('2d');
        this.layers = [];
        this.reverseLayers = [];
        this.selected = null;

        this.canvas.onmouseup = this._onMouseUp.bind(this);
        this.canvas.onmousedown = this._onMouseDown.bind(this);
        this.canvas.onmousemove = this._onMouseMove.bind(this);

        this.canvas.onmouseover = this._onMouseOver.bind(this);
        this.canvas.onmouseout = this._onMouseOut.bind(this);
    }

    _addToLayer(box){
        let layer = this.layers[box.z];
        if(layer == undefined){
            layer = {};
            this.layers[box.z] = layer;
        }
        layer[box.handle] = box;
        this.reverseLayers = [];
        for(var i in this.layers){
            this.reverseLayers.unshift(this.layers[i]);
        }
    }

    _renderOne(box){
        let ctx = new Context(this.ctx, box.x, box.y);
        box.render(ctx);
    }

    _onSelected(e){
        let x = e.pageX - this.canvas.offsetLeft;
        let y = e.pageY - this.canvas.offsetTop;
        let selected = null;
        for(var i in this.reverseLayers){
            let layer = this.reverseLayers[i];
            for(var handle in layer){
                let box = layer[handle];
                if(this.ctx.isPointInPath(box.path, x, y)){
                    selected = box;
                    break;
                }
            }
            if(selected != undefined){
                break;
            }
        }
        return selected;
    }

    _onMouseUp(e){
        let selected = this._onSelected(e);
        this.onMouseUp(e, selected);
    }

    _onMouseDown(e){
        let selected = this._onSelected(e);
        this.onMouseDown(e, selected);
    }

    _onMouseMove(e){
        let x = e.pageX - this.canvas.offsetLeft;
        let y = e.pageY - this.canvas.offsetTop;
        this.onMouseMove(e, x, y);
        let selected = this._onSelected(e);
        if(selected != undefined){
            if(this.selected == undefined || this.selected.handle != selected.handle){
                this.selected = selected;
                this.onTouch(e, selected);
            }
        } else {
            if(this.selected != undefined){
                this.selected = selected;
                this.onTouch(e, selected);
            }
        }
    }

    _onMouseOver(e){
        let x = e.pageX - this.canvas.offsetLeft;
        let y = e.pageY - this.canvas.offsetTop;
        this.onMouseOver(e, x, y);
    }

    _onMouseOut(e){
        let x = e.pageX - this.canvas.offsetLeft;
        let y = e.pageY - this.canvas.offsetTop;
        this.onMouseOut(e, x, y);
    }

    addBox(box, x, y, z){
        let handle = box.handle = uuid.v1();
        box.setPosition(x, y);
        box.z = z || 0;
        box.mount = true;
        this._addToLayer(box);
        this.render();
        return handle;
    }

    render(){
        this.clear();
        for(var i in this.layers){
            let layer = this.layers[i];
            _.forEach(layer, function(box, handle){
                this._renderOne(box);
            }.bind(this));
        }
    }

    clear(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // events

    onMouseUp(e, box){
        // override it
    }

    onMouseDown(e, box){
        // override it
    }

    onMouseMove(e, x, y){
        // override it
    }

    onMouseOver(e, x, y){
        // override it
    }

    onMouseOut(e, x, y){
        // override it
    }

    onTouch(e, box){
        // override it
    }

}