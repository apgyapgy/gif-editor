
export default class BorderElem {
    resizable = false;
    defaultWidth = 180;
    defaultHeight = 180;
    defaultContent: null;

    paint = (elem, ctx) => {
        let rect = elem.rectangle;
        let h=rect.height*0.1;
        ctx.fillStyle = "#010101";
        ctx.fillRect(0,0,rect.width,h);
        ctx.fillRect(0,rect.height-h,rect.width,h);
    }
}

