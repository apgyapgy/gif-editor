import {Element} from './Element';

export class Cursors
{
    static arrow: string = "default";
    static grip: string = "pointer";
    static cross: string = "pointer";
    static add: string ="pointer";
    static move: string = "move";
    static select: string = "pointer";
}

export class Point
{
    public x: number;
    public y: number;

    constructor(x: number, y: number)
    {
        this.x = x;
        this.y = y;
    }
}

export interface IHoverable
{
    hover: boolean;
    getCursor(point: Point): string;
}

export interface ISelectable extends IHoverable
{
    selected: boolean;
}

export interface ITheme
{
    background: string;
    selection: string;
}

export interface IElemTmpl
{
    resizable: boolean;
    defaultWidth: number;
    defaultHeight: number;
    defaultContent: any;

    paint(element: Element, context: CanvasRenderingContext2D);
    edit?(element: Element, context: CanvasRenderingContext2D, point: Point);
    selectable?(element: Element, context: CanvasRenderingContext2D): boolean;

}

export interface IUndoUnit
{
    undo(): void;
    redo(): void;
    isEmpty: boolean;
}