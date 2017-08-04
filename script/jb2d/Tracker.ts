import {Rectangle} from "./Rectangle";
import {Point, Cursors} from "./inf";
export class Tracker
{
    private _rectangle: Rectangle;
    private _resizable: boolean;
    private _track: boolean = false;
    private _handle: Point;
    private _currentPoint: Point;

    constructor(rectangle: Rectangle, resizable: boolean)
    {
        this._rectangle = rectangle.clone();
        this._resizable = resizable;
    }

    public get rectangle(): Rectangle
    {
        return this._rectangle;
    }

    public hitTest(point: Point): Point
    {
        // (0, 0) element, (-1, -1) top-left, (+1, +1) bottom-right
        if (this._resizable)
        {
            for (let x = -1; x <= +1; x++)
            {
                for (let y = -1; y <= +1; y++)
                {
                    if ((x !== 0) || (y !== 0))
                    {
                        let hit = new Point(x, y);
                        // console.log(point,hit,this.getGripRectangle(hit))
                        if (this.getGripRectangle(hit).contains(point))
                        {
                            return hit;
                        }
                    }
                }
            }
        }

        if (this._rectangle.contains(point))
        {
            return new Point(0, 0);
        }

        return new Point(-2, -2);
    }

    public getGripRectangle(point: Point): Rectangle
    {
        let r: Rectangle = new Rectangle(0, 0, 7, 7);
        if (point.x <   0) { r.x = this._rectangle.x - 7; }
        if (point.x === 0) { r.x = this._rectangle.x + Math.floor(this._rectangle.width / 2) - 3; }
        if (point.x >   0) { r.x = this._rectangle.x + this._rectangle.width + 1; }
        if (point.y <   0) { r.y = this._rectangle.y - 7; }
        if (point.y === 0) { r.y = this._rectangle.y + Math.floor(this._rectangle.height / 2) - 3; }
        if (point.y >   0) { r.y = this._rectangle.y + this._rectangle.height + 1; }
        return r;
    }

    public getCursor(point: Point): string
    {
        let hit: Point = this.hitTest(point);
        if ((hit.x === 0) && (hit.y === 0))
        {
            return (this._track) ? Cursors.move : Cursors.select;
        }
        if ((hit.x >= -1) && (hit.x <= +1) && (hit.y >= -1) && (hit.y <= +1) && this._resizable)
        {
            if (hit.x === -1 && hit.y === -1) { return "nw-resize"; }
            if (hit.x === +1 && hit.y === +1) { return "se-resize"; }
            if (hit.x === -1 && hit.y === +1) { return "sw-resize"; }
            if (hit.x === +1 && hit.y === -1) { return "ne-resize"; }
            if (hit.x ===  0 && hit.y === -1) { return "n-resize";  }
            if (hit.x ===  0 && hit.y === +1) { return "s-resize";  }
            if (hit.x === +1 && hit.y ===  0) { return "e-resize";  }
            if (hit.x === -1 && hit.y ===  0) { return "w-resize";  }
        }
        return null;
    }

    public start(point: Point, handle: Point)
    {
        if ((handle.x >= -1) && (handle.x <= +1) && (handle.y >= -1) && (handle.y <= +1))
        {
            this._handle = handle;
            this._currentPoint = point;
            this._track = true;
        }
    }

    public stop()
    {
        this._track = false;
    }

    public get track(): boolean
    {
        return this._track;
    }

    public move(point: Point)
    {
        let h: Point = this._handle;
        let a: Point = new Point(0, 0);
        let b: Point = new Point(0, 0);
        if ((h.x == -1) || ((h.x === 0) && (h.y === 0))) { a.x = point.x - this._currentPoint.x; }
        if ((h.y == -1) || ((h.x === 0) && (h.y === 0))) { a.y = point.y - this._currentPoint.y; }
        if ((h.x == +1) || ((h.x === 0) && (h.y === 0))) { b.x = point.x - this._currentPoint.x; }
        if ((h.y == +1) || ((h.x === 0) && (h.y === 0))) { b.y = point.y - this._currentPoint.y; }
        let tl: Point = new Point(this._rectangle.x, this._rectangle.y);
        let br: Point = new Point(this._rectangle.x + this._rectangle.width, this._rectangle.y + this._rectangle.height);
        tl.x += a.x;
        tl.y += a.y;
        br.x += b.x;
        br.y += b.y;
        if (br.x-tl.x<10) br.x=tl.x+10;
        if (br.y-tl.y<10) br.y=tl.y+10;
        this._rectangle.x = tl.x;
        this._rectangle.y = tl.y;
        this._rectangle.width = br.x - tl.x;
        this._rectangle.height = br.y - tl.y;
        this._currentPoint = point;
    }

    public updateRectangle(rectangle: Rectangle)
    {
        this._rectangle = rectangle.clone();
    }

    public paint(context: CanvasRenderingContext2D)
    {
        if (this._resizable)
        {
            for (let x: number = -1; x <= +1; x++)
            {
                for (let y: number = -1; y <= +1; y++)
                {
                    if ((x !== 0) || (y !== 0))
                    {
                        let rectangle: Rectangle = this.getGripRectangle(new Point(x, y));
                        context.fillStyle = "#ffffff";
                        context.strokeStyle = "#000000";
                        context.lineWidth = 1;
                        context.fillRect(rectangle.x - 0.5, rectangle.y - 0.5, rectangle.width - 1, rectangle.height - 1);
                        context.strokeRect(rectangle.x - 0.5, rectangle.y - 0.5, rectangle.width - 1, rectangle.height - 1);
                    }
                }
            }
        }
    }
}