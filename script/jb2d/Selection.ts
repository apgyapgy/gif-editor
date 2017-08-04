import {dashedLine} from "./utils";
import {Point} from "./inf";
import {Rectangle} from "./Rectangle";

export class Selection {
    private _startPoint: Point;
    private _currentPoint: Point;

    constructor(startPoint: Point) {
        this._startPoint = startPoint;
        this._currentPoint = startPoint;
    }

    public get rectangle(): Rectangle {
        let rectangle: Rectangle = new Rectangle(
            (this._startPoint.x <= this._currentPoint.x) ? this._startPoint.x : this._currentPoint.x,
            (this._startPoint.y <= this._currentPoint.y) ? this._startPoint.y : this._currentPoint.y,
            this._currentPoint.x - this._startPoint.x,
            this._currentPoint.y - this._startPoint.y);

        if (rectangle.width < 0) {
            rectangle.width *= -1;
        }

        if (rectangle.height < 0) {
            rectangle.height *= -1;
        }

        return rectangle;
    }

    public updateCurrentPoint(currentPoint: Point) {
        this._currentPoint = currentPoint;
    }

    public paint(context: CanvasRenderingContext2D) {
        let r: Rectangle = this.rectangle;
        context.lineWidth = 1;
        context.beginPath();
        dashedLine(context, r.x - 0.5, r.y - 0.5, r.x - 0.5 + r.width, r.y - 0.5);
        dashedLine(context, r.x - 0.5 + r.width, r.y - 0.5, r.x - 0.5 + r.width, r.y - 0.5 + r.height);
        dashedLine(context, r.x - 0.5 + r.width, r.y - 0.5 + r.height, r.x - 0.5, r.y - 0.5 + r.height);
        dashedLine(context, r.x - 0.5, r.y - 0.5 + r.height, r.x - 0.5, r.y - 0.5);
        context.closePath();
        context.stroke();
    }
}
