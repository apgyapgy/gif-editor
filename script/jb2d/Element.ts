import {ISelectable, Point, IElemTmpl, Cursors} from "./inf";
import {Rectangle} from "./Rectangle";
import {Tracker} from "./Tracker";
import {Graph} from "./Graph";

export class Element implements ISelectable
{
    private _template: IElemTmpl;
    private _rectangle: Rectangle;
    private _graph: Graph = null;
    private _content;
    private _hover: boolean = false;
    private _selectable:boolean=true;
    private _selected: boolean = false;
    private _tracker: Tracker = null;
    // false,不显示，
    // true，所有帧显示
    // number，特定帧显示
    //[]，如[0,0,1,1,{},{},1,0,0]。各帧定义：0无效，1同默认，{}存自定义
    private _frames=false;

    constructor(template: IElemTmpl, point: Point)
    {
        this._template = template;
        this._content = template.defaultContent;
        this._rectangle = new Rectangle(point.x, point.y, template.defaultWidth, template.defaultHeight);
    }

    public get frames(){return this._frames;}
    public set frames(val){this._frames=val;}
    public canPaint(n:number):boolean{
        if(this._frames===false) return false;
        if(this._frames===true) return true;
        if(typeof this._frames === 'number') return n==this._frames;
        return this._frames[n];
    }
    public get rectangle(): Rectangle
    {
        return ((this._tracker !== null) && (this._tracker.track)) ? this._tracker.rectangle : this._rectangle;
    }
    public set selectable(val:boolean){
        this._selectable=val;
    }

    public set rectangle(value: Rectangle)
    {
        this.invalidate();
        this._rectangle = value;
        if (this._tracker !== null)
        {
            this._tracker.updateRectangle(value);
        }
        this.invalidate();
    }

    public get template(): IElemTmpl
    {
        return this._template;
    }

    public get graph(): Graph
    {
        return this._graph;
    }

    public get tracker(): Tracker
    {
        return this._tracker;
    }

    public get selected(): boolean
    {
        return this._selected;
    }

    public set selected(value: boolean)
    {
        this._selected = value;

        if (this._selected)
        {
            this._tracker = new Tracker(this._rectangle, ("resizable" in this._template) ? this._template.resizable : false);
            this.invalidate();
        }
        else
        {
            this.invalidate();
            this._tracker = null;
        }
    }

    public get hover(): boolean
    {
        return this._hover;
    }

    public set hover(value: boolean)
    {
        this._hover = value;
    }

    public paint(context: CanvasRenderingContext2D,_index:number)
    {
    	if(this.content!=null){
	    	if((this.content.curEffect >=-1)&&(this.content.curEffect <= 5)){
	    		//console.log("undefined");
		    	if(this.content.curEffect ==2){ //突然闪现
		    		this.content.showCount++;
		    		if(this.content.showCount %2 == 0){
		    			this.content.showFlag = !this.content.showFlag;
		    		}
		    		if(this.content.showCount > 1000){
		    			this.content.showCount = 0;
		    		}
		    	}else if(this.content.curEffect == 3){//上下波动
		    		this.content.highCount++;
		    		if(this.content.highCount %2 == 0){
		    			this.content.high = -1*this.content.high;
		    		}
		    		if(this.content.highCount > 1000){
		    			this.content.highCount = 0;
		    		}
		    	}else if(this.content.curEffect == 1){//放大缩小
		    		if(this.content.size[0] < this.content.size[1]){
		    			this.content.size[0] = this.content.size[1];
		    			if(this.content.size[1] < 8)
		    				this.content.size[1] += 4;
		    			else	
		    				this.content.size[1] -= 4;
		    		}else if(this.content.size[0] > this.content.size[1]){
		    			this.content.size[0] = this.content.size[1];
		    			if(this.content.size[1] > 0)
		    				this.content.size[1] -= 4;
		    			else 
		    				this.content.size[1] += 4;
		    		}
		    	}else if(this.content.curEffect == 4){//排队闪现
		    		this.content.count++;
		    		let _arr = this.content.text.split("");
		    		let _len = _arr.length;//console.log("child:",this);
		    		//var _aa = Math.floor(_len / _index);
		    		if(this.content.count % 2 ==0){
		    			this.content.single++;
		    		}
		    		this.content.fadePos = _arr.slice(0,1);
		    		for(var i = 1;i<=this.content.single%(_len+1);i++){
		    			this.content.fadePos += _arr.slice(i,i+1);
		    		}
		    		if(this.content.count >= 120){
		    			this.content.count = 0;
		    		}
		    		if(this.content.single >= 100*(_len+1)){
		    			this.content.single = 0;
		    		}
		    	}
		    }
        }
       	this._template.paint(this, context);
        if (this._selected)
        {
            this._tracker.paint(context);
        }
    }
    
    public invalidate()
    {
    }

    public insertInto(graph: Graph)
    {
        this._graph = graph;
        this._graph.elements.push(this);
    }

    public remove()
    {
        this.invalidate();
        if ((this._graph !== null) && (this.contains(this._graph.elements,this)))
        {
            this.removeItem(this._graph.elements,this);
        }
        this._graph = null;
    }

    contains = (items,obj)=>    {
        let i = items.length;
        while (i--)
        {
            if (items[i] == obj)
            {
                return true;
            }
        }
        return false;
    }

    removeItem = (items, obj)=> {
        let i = items.length;
        while (i--)
        {
            if (items[i] == obj)
            {
                items.splice(i, 1);
            }
        }
    }

    public hitTest(rectangle: Rectangle): boolean
    {
        if(!this._selectable) return false;
        if(this._template.selectable&& !this._template.selectable(this,this._graph.context)) return false;

        if ((rectangle.width === 0) && (rectangle.height === 0))
        {
            if (this._rectangle.contains(rectangle.topLeft))
            {
                return true;
            }

            if ((this._tracker !== null)) // && (this._tracker.track)
            {
                let h = this._tracker.hitTest(rectangle.topLeft);
                if ((h.x >= -1) && (h.x <= +1) && (h.y >= -1) && (h.y <= +1))
                {
                    return true;
                }
            }
            return false;
        }

        return rectangle.contains(this._rectangle.topLeft);
    }

    public getCursor(point: Point): string
    {
        if (this._tracker !== null)
        {
            let cursor = this._tracker.getCursor(point);
            if (cursor !== null)
            {
                return cursor;
            }
        }

        if (window.event['shiftKey'])
        {
            return Cursors.add;
        }

        return Cursors.select;
    }


    public setContent(content: any)
    {
        this._graph.setElementContent(this, content);
    }

    public get content(): any
    {
        return this._content;
    }

    public set content(value: any)
    {
        this._content = value;
    }
}