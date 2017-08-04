import {IHoverable, Point, IElemTmpl, ITheme, ISelectable, Cursors} from "./inf";
import {UndoService, ContentChangedUndoUnit, DeleteElementUndoUnit, InsertElementUndoUnit, SelectionUndoUnit, TransformUndoUnit} from "./UndoService";
import {Element} from './Element';
import {Rectangle} from "./Rectangle";
import {Selection} from "./Selection";

export class Graph
{
    protected _canvas: HTMLCanvasElement;
    protected _context: CanvasRenderingContext2D;
    protected _scale:number;
    private _theme: ITheme;
    private _pointerPosition: Point = new Point(0, 0);
    private _shiftKey: boolean = false;
    private _undoService : UndoService = new UndoService();
    protected _elements: Element[] = [];
    private _activeTemplate: IElemTmpl = null;
    private _activeObject: IHoverable = null;
    protected _newElement: Element = null;
    protected _selection: Selection = null;
    protected _track: boolean = false;
    private _keyCodeTable: any;
    private _isMozilla: boolean;
    private _isWebKit: boolean;

    private _mouseDownHandler: (e: MouseEvent) => void;
    private _mouseUpHandler: (e: MouseEvent) => void;
    private _mouseMoveHandler: (e: MouseEvent) => void;
    private _doubleClickHandler: (e: MouseEvent) => void;
    private _touchStartHandler: (e: TouchEvent) => void;
    private _touchEndHandler: (e: TouchEvent) => void;
    private _touchMoveHandler: (e: TouchEvent) => void;
    private _keyDownHandler: (e: KeyboardEvent) => void;
    private _keyPressHandler: (e: KeyboardEvent) => void;
    private _keyUpHandler: (e: KeyboardEvent) => void;

    constructor(element: HTMLCanvasElement)
    {
        this._canvas = element;
        this._canvas.width = this._canvas.clientWidth * this.devicePixelRatio;
        this._canvas.height = this._canvas.clientHeight * this.devicePixelRatio;
        this._canvas.focus();
        this._context = this._canvas.getContext("2d");
        this._context.scale(this.devicePixelRatio*this._scale, this.devicePixelRatio*this._scale);

        this._theme = { background: "#fff", selection: "#000"};

        this._isWebKit = typeof navigator.userAgent.split("WebKit/")[1] !== "undefined";
        this._isMozilla = navigator.appVersion.indexOf('Gecko/') >= 0 || ((navigator.userAgent.indexOf("Gecko") >= 0) && !this._isWebKit && (typeof navigator.appVersion !== "undefined"));

        this._mouseDownHandler = (e: MouseEvent) => { this.mouseDown(e); };
        this._mouseUpHandler = (e: MouseEvent) => { this.mouseUp(e); };
        this._mouseMoveHandler = (e: MouseEvent) => { this.mouseMove(e); };
        this._doubleClickHandler = (e: MouseEvent) => { this.doubleClick(e); };
        this._touchStartHandler = (e: TouchEvent) => { this.touchStart(e); }
        this._touchEndHandler = (e: TouchEvent) => { this.touchEnd(e); }
        this._touchMoveHandler = (e: TouchEvent) => { this.touchMove(e); }
        this._keyDownHandler = (e: KeyboardEvent) => { this.keyDown(e); }
        this._keyPressHandler = (e: KeyboardEvent) => { this.keyPress(e); }
        this._keyUpHandler = (e: KeyboardEvent) => { this.keyUp(e); }

        this._canvas.addEventListener("mousedown", this._mouseDownHandler, false);
        this._canvas.addEventListener("mouseup", this._mouseUpHandler, false);
        this._canvas.addEventListener("mousemove", this._mouseMoveHandler, false);
        this._canvas.addEventListener("touchstart", this._touchStartHandler, false);
        this._canvas.addEventListener("touchend", this._touchEndHandler, false);
        this._canvas.addEventListener("touchmove", this._touchMoveHandler, false);
        this._canvas.addEventListener("dblclick", this._doubleClickHandler, false);
        this._canvas.addEventListener("keydown", this._keyDownHandler, false);
        this._canvas.addEventListener("keypress", this._keyPressHandler, false);
        this._canvas.addEventListener("keyup", this._keyUpHandler, false);
    }

    public dispose()
    {
        if (this._canvas !== null)
        {
            this._canvas.removeEventListener("mousedown", this._mouseDownHandler);
            this._canvas.removeEventListener("mouseup", this._mouseUpHandler);
            this._canvas.removeEventListener("mousemove", this._mouseMoveHandler);
            this._canvas.removeEventListener("dblclick", this._doubleClickHandler);
            this._canvas.removeEventListener("touchstart", this._touchStartHandler);
            this._canvas.removeEventListener("touchend", this._touchEndHandler);
            this._canvas.removeEventListener("touchmove", this._touchMoveHandler);
            this._canvas.removeEventListener("keydown", this._keyDownHandler);
            this._canvas.removeEventListener("keypress", this._keyPressHandler);
            this._canvas.removeEventListener("keyup", this._keyUpHandler);
            this._canvas = null;
            this._context = null;
        }
    }
	public get context(){
	        return this._context;
	}
    public get theme(): ITheme{
        return this._theme;
    }

    public set theme(value: ITheme){
        this._theme = value;
    }

    public get elements(): Element[]
    {
        return this._elements;
    }

    public addElement(template: IElemTmpl, point: Point, content: any): Element
    {
        this._activeTemplate = template;

        let element: Element = new Element(template, point);
        element.content = content;
        element.insertInto(this);
        element.invalidate();
        return element;
    }

    public createElement(template: IElemTmpl){
        this._activeTemplate = template;

        this._newElement = new Element(template, this._pointerPosition);
        this.update();

        this._canvas.focus();
    }

    public setElementContent(element: Element, content: any){
        this._undoService.begin();
        this._undoService.add(new ContentChangedUndoUnit(element, content));
        this._undoService.commit();
        this.update();
    }

    public deleteSelection(){
        this._undoService.begin();
        for (let i: number = 0; i < this._elements.length; i++)
        {
            let element: Element = this._elements[i];
            if (element.selected)
            {
                this._undoService.add(new DeleteElementUndoUnit(element));
            }
        }
        this._undoService.commit();
    }


    public get devicePixelRatio(): number{
        return (('devicePixelRatio' in window) && (window.devicePixelRatio > 1)) ? window.devicePixelRatio : 1;
    }

    private mouseDown(e: MouseEvent){
        e.preventDefault();
        this._canvas.focus();
        this.updateMousePosition(e);

        if (e.button === 0) // left-click
        {
            // alt+click allows fast creation of element using the active template
            if ((this._newElement === null) && (e.altKey))
            {
                this.createElement(this._activeTemplate);
            }

            this.pointerDown();
        }
    }
    private mouseUp(e: MouseEvent){
        e.preventDefault();
        this.updateMousePosition(e);
        if (e.button === 0) // left-click
        {
            this.pointerUp();
        }
    }
    private mouseMove(e: MouseEvent){
        e.preventDefault();
        this.updateMousePosition(e);
        this.pointerMove();
    }
    private doubleClick(e: MouseEvent){
        e.preventDefault();
        this.updateMousePosition(e);
        if (e.button === 0) // left-click
        {
            let point: Point = this._pointerPosition;

            this.updateActiveObject(point);
            if ((this._activeObject !== null) && (this._activeObject instanceof Element))
            {
                let element: Element = <Element> this._activeObject;
                if ((element.template !== null) && ("edit" in element.template))
                {
                    element.template.edit(element, this._context, point);
                    this.update();
                }
            }
        }
    }

    private touchStart(e: TouchEvent)
    {
        if (e.touches.length == 1)
        {
            e.preventDefault();
            this.updateTouchPosition(e);
            this.pointerDown();
        }
    }

    private touchEnd(e: TouchEvent)
    {
        e.preventDefault();
        this.pointerUp();
    }

    private touchMove(e: TouchEvent)
    {  	
        if (e.touches.length == 1)
        {
            e.preventDefault();
            this.updateTouchPosition(e);
            this.pointerMove();
        }
    }

    private pointerDown()
    {
        let point: Point = this._pointerPosition;

        if (this._newElement !== null)
        {
            this._undoService.begin();
            this._newElement.invalidate();
            this._newElement.rectangle = new Rectangle(point.x, point.y, this._newElement.rectangle.width, this._newElement.rectangle.height);
            this._newElement.invalidate();
            this._undoService.add(new InsertElementUndoUnit(this._newElement, this));
            this._undoService.commit();
            this._newElement = null;
        }
        else {
            this._selection = null;
            this.updateActiveObject(point);
            if (this._activeObject === null) {
                // start selection
                this._selection = new Selection(point);
            }
            else {
                // select object
                let selectable: ISelectable = <ISelectable> this._activeObject;
                if (!selectable.selected) {
                    this._undoService.begin();
                    let selectionUndoUnit: SelectionUndoUnit = new SelectionUndoUnit();
                    if (!this._shiftKey) {
                        this.deselectAll(selectionUndoUnit);
                    }
                    selectionUndoUnit.select(selectable);
                    this._undoService.add(selectionUndoUnit);
                    this._undoService.commit();
                }
                else if (this._shiftKey) {
                    this._undoService.begin();
                    let deselectUndoUnit: SelectionUndoUnit = new SelectionUndoUnit();
                    deselectUndoUnit.deselect(selectable);
                    this._undoService.add(deselectUndoUnit);
                    this._undoService.commit();
                }
                // start tracking
                let hit = new Point(0, 0);
                if (this._activeObject instanceof Element) {
                    let element: Element = <Element> this._activeObject;
                    hit = element.tracker.hitTest(point);
                }
                for (let i = 0; i < this._elements.length; i++) {
                    let element: Element = this._elements[i];
                    if (element.tracker !== null) {
                        element.tracker.start(point, hit);
                    }
                }
                this._track = true;
            }
        }

        this.update();
        this.updateMouseCursor();
    }

    private pointerUp()
    {
        let point: Point = this._pointerPosition;

        if (this._selection !== null)
        {
            this._undoService.begin();

            let selectionUndoUnit: SelectionUndoUnit = new SelectionUndoUnit();

            let rectangle: Rectangle = this._selection.rectangle;
            let selectable: ISelectable = <ISelectable> this._activeObject;
            if ((this._activeObject === null) || (!selectable.selected))
            {
                if (!this._shiftKey)
                {
                    this.deselectAll(selectionUndoUnit);
                }
            }

            if ((rectangle.width !== 0) || (rectangle.height !== 0))
            {
                this.selectAll(selectionUndoUnit, rectangle);
            }

            this._undoService.add(selectionUndoUnit);
            this._undoService.commit();
            this._selection = null;
        }

        if (this._track)
        {
            this._undoService.begin();
            for (let i = 0; i < this._elements.length; i++)
            {
                let element: Element = this._elements[i];
                if (element.tracker !== null)
                {
                    element.tracker.stop();
                    element.invalidate();
                    let r1: Rectangle = element.rectangle;
                    let r2: Rectangle = element.tracker.rectangle;
                    if ((r1.x != r2.x) || (r1.y != r2.y) || (r1.width != r2.width) || (r1.height != r2.height))
                    {
                        this._undoService.add(new TransformUndoUnit(element, r1, r2));
                    }
                }
            }

            this._undoService.commit();
            this._track = false;
            this.updateActiveObject(point);
        }

        this.update();
        this.updateMouseCursor();
    }

    private pointerMove()
    {
        let point: Point = this._pointerPosition;

        if (this._newElement !== null)
        {
            // placing new element
            this._newElement.invalidate();
            this._newElement.rectangle = new Rectangle(point.x, point.y, this._newElement.rectangle.width, this._newElement.rectangle.height);
            this._newElement.invalidate();
        }

        if (this._track)
        {
            // moving selected elements
            for (let i: number = 0; i < this._elements.length; i++)
            {
                let element: Element = this._elements[i];
                if (element.tracker !== null)
                {
                    element.invalidate();
                    element.tracker.move(point);
                    element.invalidate();
                }
            }
        }

        if (this._selection !== null)
        {
            this._selection.updateCurrentPoint(point);
        }

        this.updateActiveObject(point);
        //this.update();
        this.updateMouseCursor();
    }


    private keyDown(e: KeyboardEvent)
    {
        if (!this._isMozilla)
        {
            this.processKey(e, e.keyCode);
        }
    }

    private keyPress(e: KeyboardEvent)
    {
        if (this._isMozilla)
        {
            if (typeof this._keyCodeTable === "undefined")
            {
                this._keyCodeTable = [];
                let charCodeTable: any = {
                    32: ' ',  48: '0',  49: '1',  50: '2',  51: '3',  52: '4', 53:  '5',  54: '6',  55: '7',  56: '8',  57: '9',  59: ';',  61: '=',
                    65:  'a', 66: 'b',  67: 'c',  68: 'd',  69: 'e',  70: 'f',  71: 'g', 72:  'h',  73: 'i',  74: 'j',  75: 'k',  76: 'l',  77: 'm',  78: 'n', 79:  'o', 80: 'p',  81: 'q',  82: 'r',  83: 's',  84: 't',  85: 'u', 86: 'v', 87: 'w',  88: 'x',  89: 'y',  90: 'z',
                    107: '+', 109: '-', 110: '.', 188: ',', 190: '.', 191: '/', 192: '`', 219: '[', 220: '\\', 221: ']', 222: '\"'
                }

                for (let keyCode in charCodeTable)
                {
                    let key: string = charCodeTable[keyCode];
                    this._keyCodeTable[key.charCodeAt(0)] = keyCode;
                    if (key.toUpperCase() != key)
                    {
                        this._keyCodeTable[key.toUpperCase().charCodeAt(0)] = keyCode;
                    }
                }
            }

            this.processKey(e, (this._keyCodeTable[e.charCode]) ? this._keyCodeTable[e.charCode] : e.keyCode);
        }
    }

    private keyUp(e: KeyboardEvent)
    {
        this.updateMouseCursor();
    }

    private processKey(e: KeyboardEvent, keyCode: number)
    {
        if ((e.ctrlKey || e.metaKey) && !e.altKey) // ctrl or option
        {
            if (keyCode == 65) // A - select all
            {
                this._undoService.begin();
                let selectionUndoUnit = new SelectionUndoUnit();
                this.selectAll(selectionUndoUnit, null);
                this._undoService.add(selectionUndoUnit);
                this._undoService.commit();
                this.update();
                this.updateActiveObject(this._pointerPosition);
                this.updateMouseCursor();
                this.stopEvent(e);
            }

            if ((keyCode == 90) && (!e.shiftKey)) // Z - undo
            {
                this._undoService.undo();
                this.update();
                this.updateActiveObject(this._pointerPosition);
                this.updateMouseCursor();
                this.stopEvent(e);
            }

            if (((keyCode == 90) && (e.shiftKey)) || (keyCode == 89)) // Y - redo
            {
                this._undoService.redo();
                this.update();
                this.updateActiveObject(this._pointerPosition);
                this.updateMouseCursor();
                this.stopEvent(e);
            }
        }

        if ((keyCode == 46) || (keyCode == 8)) // DEL - delete
        {
            this.deleteSelection();
            this.update();
            this.updateActiveObject(this._pointerPosition);
            this.updateMouseCursor();
            this.stopEvent(e);
        }

        if (keyCode == 27) // ESC
        {
            this._newElement = null;

            this._track = false;
            for (let i: number = 0; i < this._elements.length; i++)
            {
                let element = this._elements[i];
                if (element.tracker !== null)
                {
                    element.tracker.stop();
                }
            }

            this.update();
            this.updateActiveObject(this._pointerPosition);
            this.updateMouseCursor();
            this.stopEvent(e);
        }
    }

    private stopEvent(e: Event){
        e.preventDefault();
        e.stopPropagation();
    }

    private selectAll(selectionUndoUnit: SelectionUndoUnit, rectangle: Rectangle){
        for (let i: number = 0; i < this._elements.length; i++)
        {
            let element: Element = this._elements[i];
            if ((rectangle === null) || (element.hitTest(rectangle)))
            {
                selectionUndoUnit.select(element);
            }
        }
    }

    private deselectAll(selectionUndoUnit: SelectionUndoUnit){
        for (let i: number = 0; i < this._elements.length; i++)
        {
            let element: Element = this._elements[i];
            selectionUndoUnit.deselect(element);
        }
    }

    private updateActiveObject(point: Point){
        let hitObject: IHoverable = this.hitTest(point);
        if (hitObject != this._activeObject)
        {
            if (this._activeObject !== null)
            {
                this._activeObject.hover = false;
            }

            this._activeObject = hitObject;

            if (this._activeObject !== null)
            {
                this._activeObject.hover = true;
            }
        }
    }

    protected hitTest(point: Point): IHoverable{
        let rectangle: Rectangle = new Rectangle(point.x, point.y, 0, 0);
        for (let i: number = 0; i < this._elements.length; i++)
        {
            let element: Element = this._elements[i];
            if (element.hitTest(rectangle))
            {
                return element;
            }
        }
        return null;
    }

    private updateMouseCursor(){
        this._canvas.style.cursor = (this._activeObject !== null) ? this._activeObject.getCursor(this._pointerPosition) : Cursors.arrow;
    }

    private updateMousePosition(e: MouseEvent){
        this._shiftKey = e.shiftKey;
        var rect = this._canvas.getBoundingClientRect();
        this._pointerPosition = new Point((e.clientX - rect.left)/this._scale, (e.clientY - rect.top)/this._scale);
    }
    private updateMousePosition3(e: MouseEvent){
        this._shiftKey = e.shiftKey;
        this._pointerPosition = new Point(e.pageX, e.pageY);
        let node: HTMLElement = this._canvas;
        while (node !== null)
        {
            this._pointerPosition.x -= node.offsetLeft;
            this._pointerPosition.y -= node.offsetTop;
            node = <HTMLElement> node.offsetParent;
        }
    }

    private updateTouchPosition(e: TouchEvent)
    {
        this._shiftKey = false;
        this._pointerPosition = new Point(e.touches[0].pageX, e.touches[0].pageY);
        let node: HTMLElement = this._canvas;
        while (node !== null)
        {
            this._pointerPosition.x -= node.offsetLeft;
            this._pointerPosition.y -= node.offsetTop;
            node = <HTMLElement> node.offsetParent;
        }
    }

    protected update()
    {
        this._canvas.style.background = this.theme.background;
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        for (let i: number = 0; i < this._elements.length; i++)
        {
            this._context.save();
            this._elements[i].paint(this._context,i);
            this._context.restore();
        }

        if (this._newElement !== null)
        {
            this._context.save();
            this._newElement.paint(this._context,-1);
            this._context.restore();
        }

        if (this._selection !== null)
        {
            this._context.strokeStyle = this.theme.selection;
            this._selection.paint(this._context);
        }
    }
}