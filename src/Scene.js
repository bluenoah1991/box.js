import _ from 'lodash';
import uuid from 'node-uuid';

import Context from './Context';

export default class Scene{
    constructor(id, opts){
        this.canvas = document.getElementById(id);
        this.$canvas = $(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.boxs = {};
        this.layers = [];
        this.reverseLayers = [];
        this.selected = null;
        this.elementContainer = this._initElementContainer();
        this.elements = {};

        // Options
        this.opts = opts || {};
        this.infinity = this.opts.infinity || false;
        this.scaleX = this.opts.scaleX || 1;
        this.scaleY = this.opts.scaleY || 1;
        this.ctx.scale(this.scaleX, this.scaleY);

        // Parameters associated with Infinite Canvas
        this.offsetX = 0;
        this.offsetY = 0;

        // Parameters associated with Mousedown
        this.mousedown = false;
        this.originX = -1;
        this.originY = -1;

        // Register Event
        if(this._isMobile()){
            this.$canvas.on('touchstart', this._onTouchStart.bind(this));
            this.$canvas.on('touchmove', this._onTouchMove.bind(this));
            this.$canvas.on('touchend', this._onTouchEnd.bind(this));
            this.$canvas.on('touchcancel', this._onTouchCancel.bind(this));

            this.elementContainer.on('touchstart', '*', this._onContainerTouchStart.bind(this));
            this.elementContainer.on('touchmove', '*', this._onTouchMove.bind(this));
            this.elementContainer.on('touchend', '*', this._onContainerTouchEnd.bind(this));
            this.elementContainer.on('touchcancel', '*', this._onContainerTouchCancel.bind(this));
        } else {
            this.$canvas.on('mouseup', this._onMouseUp.bind(this));
            this.$canvas.on('mousedown', this._onMouseDown.bind(this));
            this.$canvas.on('mousemove', this._onMouseMove.bind(this));
            this.$canvas.on('mouseover', this._onMouseOver.bind(this));
            this.$canvas.on('mouseout', this._onMouseOut.bind(this));

            this.elementContainer.on('mouseup', '*', this._onContainerMouseUp.bind(this));
            this.elementContainer.on('mousedown', '*', this._onContainerMouseDown.bind(this));
            this.elementContainer.on('mousemove', '*', this._onMouseMove.bind(this));
            this.elementContainer.on('mouseover', '*', this._onContainerMouseOver.bind(this));
            this.elementContainer.on('mouseout', '*', this._onContainerMouseOut.bind(this));
        }
    }

    _isMobile(){
        // return true;
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    _initElementContainer(){
        let border_top_width = parseInt(this.$canvas.css('border-top-width'));
        let border_right_width = parseInt(this.$canvas.css('border-right-width'));
        let border_bottom_width = parseInt(this.$canvas.css('border-bottom-width'));
        let border_left_width = parseInt(this.$canvas.css('border-left-width'));
        let container = $('<div />');
        container.css({
            display: 'inline-block',
            overflow: 'hidden',
            width: this.$canvas.width() - border_left_width - border_right_width,
            height: this.$canvas.height() - border_top_width - border_bottom_width,
            position: 'absolute',
            left: this.canvas.offsetLeft + border_left_width,
            top: this.canvas.offsetTop + border_top_width,
            pointerEvents: 'none'
        });
        $('body').append(container);
        return container;
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

    _addToDom(box){
        this.elements[box.handle] = box;
        box.element.attr('handle', box.handle);
        box.element.css('pointer-events', 'auto');
        box.element.css('display', 'inline-block');
        box.element.css('position', 'absolute');
        box.element.css('left', box.x);
        box.element.css('top', box.y);
        this.elementContainer.append(box.element);
    }

    _removeFromLayer(box){
        let layer = this.layers[box.z];
        if(layer != undefined){
            delete layer[box.handle];
        }
    }

    _removeFromDom(box){
        box.element.remove();
        delete this.elements[box.handle];
    }

    _renderOne(box){
        if(box.isElement){
            if(box.show_){
                box.element.css('display', 'inline-block');
                box.element.css('left', box.x + this.offsetX);
                box.element.css('top', box.y + this.offsetY);
            } else {
                box.element.css('display', 'none');
            }
        } else if(box.show_) {
            let ctx = new Context(this.ctx, box.x + this.offsetX, box.y + this.offsetY);
            box.render(ctx);
            box.paths = ctx._getPaths();
        }
    }

    _onSelected(x, y){
        x = x * this.scaleX;
        y = y * this.scaleY;
        let selected = null;
        for(var i in this.reverseLayers){
            let layer = this.reverseLayers[i];
            for(var handle in layer){
                let box = layer[handle];
                if(box._include(x, y)){
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

    // Methods associated with Mousedown

    _MouseDown(x, y){
        this.mousedown = true;
        this.originX = x;
        this.originY = y;
    }

    _MouseUp(){
        this.mousedown = false;
        this.originX = -1;
        this.originY = -1;
    }

    // Canvas Events

    _onMouseUp(e){
        e.preventDefault();
        let x = e.pageX - this.canvas.offsetLeft;
        let y = e.pageY - this.canvas.offsetTop;
        this._MouseUp();
        let selected = this._onSelected(x, y);
        if(selected != undefined){
            selected.onMouseUp(e, x, y);
        }
        this.onMouseUp(e, x, y, selected);
    }

    _onMouseDown(e){
        e.preventDefault();
        let x = e.pageX - this.canvas.offsetLeft;
        let y = e.pageY - this.canvas.offsetTop;
        this._MouseDown(x, y);
        let selected = this._onSelected(x, y);
        if(selected != undefined){
            selected.onMouseDown(e, x, y);
        }
        this.onMouseDown(e, x, y, selected);
    }

    _onMouseMove(e){
        e.preventDefault();
        let x = e.pageX - this.canvas.offsetLeft;
        let y = e.pageY - this.canvas.offsetTop;
        this.onMouseMove(e, x, y);
        let selected = this._onSelected(x, y);
        if(selected != undefined){
            if(this.selected == undefined || this.selected.handle != selected.handle){
                this.selected = selected;
                this.onTouch(e, x, y, selected);
                selected.onMouseOver(e, x, y);
            }
        } else {
            if(this.selected != undefined){
                let originalSelected = this.selected;
                this.selected = selected;
                this.onTouch(e, x, y, selected);
                originalSelected.onMouseOut(e, x, y);
            }
            if(this.infinity && this.mousedown){
                this.offsetX += x - this.originX;
                this.offsetY += y - this.originY;
                this.originX = x;
                this.originY = y;
                this.render();
            }
        }
    }

    _onMouseOver(e){
        e.preventDefault();
        let from = $(e.fromElement);
        if(from.attr('handle') in this.elements){
            return;
        }
        let x = e.pageX - this.canvas.offsetLeft;
        let y = e.pageY - this.canvas.offsetTop;
        this.onMouseOver(e, x, y);
    }

    _onMouseOut(e){
        e.preventDefault();
        let to = $(e.toElement);
        if(to.attr('handle') in this.elements){
            return;
        }
        let x = e.pageX - this.canvas.offsetLeft;
        let y = e.pageY - this.canvas.offsetTop;
        this._MouseUp();
        this.onMouseOut(e, x, y);
    }

    // Canvas Touch Events

    _onTouchStart(e){
        e.preventDefault();
        let x = e.touches[0].pageX - this.canvas.offsetLeft;
        let y = e.touches[0].pageY - this.canvas.offsetTop;
        this._MouseDown(x, y);
        let selected = this._onSelected(x, y);
        if(selected != undefined){
            selected.onTouchStart(e, x, y);
        }
        this.onTouchStart(e, x, y, selected);
    }

    _onTouchMove(e){
        e.preventDefault();
        let x = e.touches[0].pageX - this.canvas.offsetLeft;
        let y = e.touches[0].pageY - this.canvas.offsetTop;
        this.onTouchMove(e, x, y);
        let selected = this._onSelected(x, y);
        if(selected != undefined){
            if(this.selected == undefined || this.selected.handle != selected.handle){
                this.selected = selected;
                this.onTouch(e, x, y, selected);
                selected.onTouchEnter(e, x, y);
            }
        } else {
            if(this.selected != undefined){
                let originalSelected = this.selected;
                this.selected = selected;
                this.onTouch(e, x, y, selected);
                originalSelected.onTouchLeave(e, x, y);
            }
            if(this.infinity && this.mousedown){
                this.offsetX += x - this.originX;
                this.offsetY += y - this.originY;
                this.originX = x;
                this.originY = y;
                this.render();
            }
        }
    }

    _onTouchEnd(e){
        e.preventDefault();
        let x = e.changedTouches[0].pageX - this.canvas.offsetLeft;
        let y = e.changedTouches[0].pageY - this.canvas.offsetTop;
        this._MouseUp();
        let selected = this._onSelected(x, y);
        if(selected != undefined){
            selected.onTouchEnd(e, x, y);
        }
        this.onTouchEnd(e, x, y, selected);
    }

    _onTouchCancel(e){
        this._onTouchEnd(e);
    }

    // Elements Container Touch Events

    _onContainerTouchStart(e){
        e.preventDefault();
        let element = $(e.target);
        if(element.attr('handle') != undefined){
            let box = this.elements[element.attr('handle')];
            if(box != undefined){
                let x = e.touches[0].pageX - this.canvas.offsetLeft;
                let y = e.touches[0].pageY - this.canvas.offsetTop;
                this.onTouchStart(e, x, y, box);
                box.onTouchStart(e, x, y);
            }
        }
    }

    _onContainerTouchEnd(e){
        e.preventDefault();
        let element = $(e.target);
        if(element.attr('handle') != undefined){
            let box = this.elements[element.attr('handle')];
            if(box != undefined){
                let x = e.changedTouches[0].pageX - this.canvas.offsetLeft;
                let y = e.changedTouches[0].pageY - this.canvas.offsetTop;
                this.onTouchEnd(e, x, y, box);
                box.onTouchEnd(e, x, y);
            }
        }
    }

    _onContainerTouchCancel(e){
        this._onContainerTouchEnd(e);
    }

    // Elements Container Events

    _onContainerMouseUp(e){
        // http://stackoverflow.com/questions/13236484/mouseup-not-working-after-mousemove-on-img
        e.preventDefault();
        let element = $(e.target);
        if(element.attr('handle') != undefined){
            let box = this.elements[element.attr('handle')];
            if(box != undefined){
                let x = e.pageX - this.canvas.offsetLeft;
                let y = e.pageY - this.canvas.offsetTop;
                this.onMouseUp(e, x, y, box);
                box.onMouseUp(e, x, y);
            }
        }
    }

    _onContainerMouseDown(e){
        e.preventDefault();
        let element = $(e.target);
        if(element.attr('handle') != undefined){
            let box = this.elements[element.attr('handle')];
            if(box != undefined){
                let x = e.pageX - this.canvas.offsetLeft;
                let y = e.pageY - this.canvas.offsetTop;
                this.onMouseDown(e, x, y, box);
                box.onMouseDown(e, x, y);
            }
        }
    }

    _onContainerMouseOver(e){
        e.preventDefault();
        let element = $(e.target);
        if(element.attr('handle') != undefined){
            let box = this.elements[element.attr('handle')];
            if(box != undefined){
                let x = e.pageX - this.canvas.offsetLeft;
                let y = e.pageY - this.canvas.offsetTop;
                this.onTouch(e, x, y, box);
                box.onMouseOver(e, x, y);
                if(x > 0 && x < this.canvas.width &&
                    y > 0 && y < this.canvas.height){
                        this.onMouseOver(e, x, y);
                    }
            }
        }
    }

    _onContainerMouseOut(e){
        e.preventDefault();
        let element = $(e.target);
        if(element.attr('handle') != undefined){
            let box = this.elements[element.attr('handle')];
            if(box != undefined){
                let x = e.pageX - this.canvas.offsetLeft;
                let y = e.pageY - this.canvas.offsetTop;
                this.onTouch(e, x, y, null);
                box.onMouseOut(e, x, y);
                if(x < 0 || x > this.canvas.width ||
                    y < 0 || y > this.canvas.height){
                        this._MouseUp();
                        this.onMouseOut(e, x, y);
                    }
            }
        }
    }

    // Public Methods

    addBox(box, x, y, z){
        let handle = box.handle = uuid.v1();
        this.boxs[handle] = box;
        box.setPosition(x, y, z);
        if(box.isElement){
            this._addToDom(box);
        } else {
            this._addToLayer(box);
            this.render();
        }
        box.scene = this;
        box.mount = true;
        return handle;
    }

    removeBox(handle){
        let box = this.boxs[handle];
        if(box != undefined){
            if(box.isElement){
                this._removeFromDom(box);
            } else {
                this._removeFromLayer(box);
                this.render();
            }
            delete this.boxs[handle];
            box._removePosition();
            box.scene = null;
            box.mount = false;
            return true;
        } else {
            return false;
        }
    }

    render(){
        this.clear();
        for(var i in this.layers){
            let layer = this.layers[i];
            _.forEach(layer, function(box, handle){
                this._renderOne(box);
            }.bind(this));
        }
        _.forEach(this.elements, function(element){
            this._renderOne(element);
        }.bind(this));
    }

    clear(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    close(){
        _.forEach(this.boxs, function(box, handle){
            this.removeBox(handle);
        }.bind(this));
        this.clear();
    }

    // events

    onMouseUp(e, x, y, box){
        // override it
    }

    onMouseDown(e, x, y, box){
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

    onTouch(e, x, y, box){
        // override it
    }

    // touch events

    onTouchStart(e, x, y, box){
        // override it
    }

    onTouchMove(e, x, y){
        // override it
    }

    onTouchEnd(e, x, y, box){
        // override it
    }

}