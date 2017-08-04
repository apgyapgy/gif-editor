
export const dashedLine=(context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number)=>
{
    context.moveTo(x1, y1);

    let dx: number = x2 - x1;
    let dy: number = y2 - y1;
    let count: number = Math.floor(Math.sqrt(dx * dx + dy * dy) / 3); // dash length
    let ex: number = dx / count;
    let ey: number = dy / count;

    let q: number = 0;
    while (q++ < count)
    {
        x1 += ex;
        y1 += ey;
        if (q % 2 === 0)
        {
            context.moveTo(x1, y1);
        }
        else
        {
            context.lineTo(x1, y1);
        }
    }
    if (q % 2 === 0)
    {
        context.moveTo(x2, y2);
    }
    else
    {
        context.lineTo(x2, y2);
    }
}