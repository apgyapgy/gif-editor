import {Graph} from "./Graph";
import {Point, IElemTmpl, IHoverable} from "./inf";
import {Element} from './Element';
import {Rectangle} from "./Rectangle";

export class Movie extends Graph{
    private delays=[1000,200,100,50,33]
    private _size:number=1;
    private _curFrame:number=0;
    private _delay=100;
    private _order=0;
    private _reverse=false;
    private _playCtrl=null;
    private _playing=false;
    private _effect=null;
    private _effectCount=0;


    constructor(element: HTMLCanvasElement,size:number,width:number,height:number,scale:number){
        super(element)
        this._scale=scale;
        this._size=size;
        this._canvas.width=width;
        this._canvas.height=height;
    }

    private _getData(frames, reverse:boolean=false) {
        let next = reverse ? this._size - 1 : 0;
        for (let i = 0; i < this._size; i++) {
            this._curFrame = next;
            this.update()
            let str = this._canvas.toDataURL("image/png")
            frames.push(str)
            next = reverse ? next - 1 : next + 1;
        }
    }

    public effect(fn){
        this._effect=fn;
        this.update()
    }
    public effectCount(n:number){
        this._effectCount=n;
    }

    public getData(){
        this._playing=false;
        this._selection=null;
        this.update()
        let data={Delay:this._delay,Width: this._canvas.width,Height: this._canvas.height,  Frames:[]}
        let t=this._curFrame;
        if (this._order==0) {
            this._getData(data.Frames)
        }else if(this._order==1){
            this._getData(data.Frames,true)
        }else {
            this._getData(data.Frames)
            this._getData(data.Frames,true)
        }
        this._curFrame=t;
        this.update();//console.log("getData:",data);
        return data;
    }
    public addFrameElem(template: IElemTmpl, point: Point, content: any,frames:any): Element
    {
        let elem=super.addElement(template,point,content);
        elem.frames=frames;
        return elem;
    }

    public get playing(){return this._playing}

    public play() {
        if(this.playing) return;

        this._playing=true;
        this._playCtrl = setInterval(() => {
//      	console.log("interval")
            let next=this._curFrame;
            if(this._reverse) {
                next = this._curFrame - 1;
                if (next <0){
                    if(this._order==2){
                        this._reverse=!this._reverse;
                    }else{
                        next = this._size-1;
                    }
                }
            }else{
                next = this._curFrame + 1;
                if (next >= this._size){
                    if(this._order==2){
                        this._reverse=!this._reverse;
                    }else{
                        next = 0;
                    }
                }
            }
            this.showFrame(next)
        }, this._delay);
    }
    public set delay(n:number){
        this._delay=this.delays[n];
        this.replay();
    }
    public get delay(){
        return this.delays.indexOf(this._delay);
    }
    public set order(n:number){
        this._order=n;
        this._reverse=n==1;
        this.replay();
    }
    public get order(){
        return this._order;
    }
    public first=()=>this.showFrame(0);
    public last=()=>this.showFrame(this._size-1);
    public pre=()=>this.showFrame(this._curFrame-1);
    public next=()=>this.showFrame(this._curFrame+1);
    public stop=()=>{
        clearInterval(this._playCtrl);
        this._playing=false;
    }
    public replay() {
        this.stop();
        // this.first();
        this.play();
    }
    public noSelection(){
        this._selection=null;
        for (let i = 0; i < this._elements.length; i++) {
            let element: Element = this._elements[i];
            element.selected=false;
        }
        this.update()
    }

    public showFrame(i:number){
        if(i<0) 
        	this._curFrame=0;
        else if(i>=this._size-1) 
        	this._curFrame=this._size-1;
        else 
        	this._curFrame=i;
        this.update()
    }

    protected update()
    {
        // this._canvas.style.background = this.theme.background;
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        // if(this._playing){this._context.save();this._elements[0].paint(this._context);this._context.restore();}
        for (let i: number = 0; i < this._elements.length; i++) {
            let elem = this._elements[i];
            if (elem.canPaint(this._curFrame)) {//console.log("canpaing");
                this._context.save();
                this._elements[i].paint(this._context,this._elements.length);
                this._context.restore();
            }
            if (i==this._effectCount-1 && this._effect){
                this._effect(this._canvas,this._context);
            }
        }
        if (this._newElement !== null){//console.log("newElement");
            this._context.save();
            this._newElement.paint(this._context,this._elements.length);
            this._context.restore();
        }

        if (this._selection !== null)
        {
        	//console.log("_selection");
            this._context.strokeStyle = this.theme.selection;
            this._selection.paint(this._context);
        }
    }

    protected hitTest(point: Point): IHoverable
    {
        let rectangle: Rectangle = new Rectangle(point.x, point.y, 0, 0);
        for (let i: number = this._elements.length-1; i >=0 ; i--)
        {
            let element: Element = this._elements[i];
            if (element.frames[this._curFrame]!=0 && element.hitTest(rectangle))
            {
                return element;
            }
        }
        return null;
    }

    public dispose(){
        this.stop();
        super.dispose();
    }
}