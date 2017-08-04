import {IUndoUnit, ISelectable} from "./inf";
import {Element} from './Element';
import {Graph} from "./Graph";
import {Rectangle} from "./Rectangle";

export class SelectionUndoUnit implements IUndoUnit
{
    private _states: any[] = [];

    public undo()
    {
        for (let i: number = 0; i < this._states.length; i++)
        {
            this._states[i].value.selected = this._states[i].undo;
        }
    }

    public redo()
    {
        for (let i: number = 0; i < this._states.length; i++)
        {
            this._states[i].value.selected = this._states[i].redo;
        }
    }

    public get isEmpty(): boolean
    {
        for (let i: number = 0; i < this._states.length; i++)
        {
            if (this._states[i].undo != this._states[i].redo)
            {
                return false;
            }
        }
        return true;
    }

    public select(value: ISelectable)
    {
        this.update(value, value.selected, true);
    }

    public deselect(value: ISelectable)
    {
        this.update(value, value.selected, false);
    }

    private update(value: ISelectable, undo: boolean, redo: boolean)
    {
        for (let i: number = 0; i < this._states.length; i++)
        {
            if (this._states[i].value == value)
            {
                this._states[i].redo = redo;
                return;
            }
        }

        this._states.push({ value: value, undo: undo, redo: redo });
    }
}
export class TransformUndoUnit implements IUndoUnit
{
    private _element: Element;
    private _undoRectangle: Rectangle;
    private _redoRectangle: Rectangle;

    constructor(element: Element, undoRectangle: Rectangle, redoRectangle: Rectangle)
    {
        this._element = element;
        this._undoRectangle = undoRectangle.clone();
        this._redoRectangle = redoRectangle.clone();
    }

    public undo()
    {
        this._element.rectangle = this._undoRectangle;
    }

    public redo()
    {
        this._element.rectangle = this._redoRectangle;
    }

    public get isEmpty(): boolean
    {
        return false;
    }
}
class ContainerUndoUnit implements IUndoUnit
{
    private _undoUnits: IUndoUnit[] = [];

    public add(undoUnit: IUndoUnit)
    {
        this._undoUnits.push(undoUnit);
    }

    public undo()
    {
        for (let i = 0; i < this._undoUnits.length; i++)
        {
            this._undoUnits[i].undo();
        }
    }

    public redo()
    {
        for (let i = 0; i < this._undoUnits.length; i++)
        {
            this._undoUnits[i].redo();
        }
    }

    public get isEmpty(): boolean
    {
        if (this._undoUnits.length > 0)
        {
            for (let i = 0; i < this._undoUnits.length; i++)
            {
                if (!this._undoUnits[i].isEmpty)
                {
                    return false;
                }
            }
        }
        return true;
    }
}

export class ContentChangedUndoUnit implements IUndoUnit
{
    private _element: Element;
    private _undoContent: any;
    private _redoContent: any;

    constructor(element: Element, content: any)
    {
        this._element = element;
        this._undoContent = element.content;
        this._redoContent = content;
    }

    public undo()
    {
        this._element.content = this._undoContent;
    }

    public redo()
    {
        this._element.content = this._redoContent;
    }

    public get isEmpty(): boolean
    {
        return false;
    }
}

export class DeleteElementUndoUnit implements IUndoUnit
{
    private _element: Element;
    private _graph: Graph;

    constructor(element: Element)
    {
        this._element = element;
        this._graph = element.graph;
    }

    public undo()
    {
        this._element.insertInto(this._graph);
    }

    public redo()
    {
        this._element.remove();
    }

    public get isEmpty(): boolean
    {
        return false;
    }
}

export class InsertElementUndoUnit implements IUndoUnit
{
    private _element: Element;
    private _graph: Graph;

    constructor(element: Element, graph: Graph)
    {
        this._element = element;
        this._graph = graph;
    }

    public undo()
    {
        this._element.remove();
    }

    public redo()
    {
        this._element.insertInto(this._graph);
    }

    public get isEmpty(): boolean
    {
        return false;
    }
}

export class UndoService
{
    private _container: ContainerUndoUnit = null;
    private _stack: ContainerUndoUnit[] = [];
    private _position: number = 0;

    public begin()
    {
        this._container = new ContainerUndoUnit();
    }

    public cancel()
    {
        this._container = null;
    }

    public commit()
    {
        if (!this._container.isEmpty)
        {
            this._stack.splice(this._position, this._stack.length - this._position);
            this._stack.push(this._container);
            this.redo();
        }
        this._container = null;
    }

    public add(undoUnit: IUndoUnit)
    {
        this._container.add(undoUnit);
    }

    public undo()
    {
        if (this._position !== 0)
        {
            this._position--;
            this._stack[this._position].undo();
        }
    }

    public redo()
    {
        if ((this._stack.length !== 0) && (this._position < this._stack.length))
        {
            this._stack[this._position].redo();
            this._position++;
        }
    }
}