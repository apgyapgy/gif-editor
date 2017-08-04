import {Element} from '../Element';

export class ImgElemProps{
    src:string="";
}

export default class ImgElem {
    resizable = true;
    defaultWidth = 180;
    defaultHeight = 180;
    defaultContent: ImgElemProps = {src: null};
    img=null;

    paint = (elem, ctx) => {
        let rect = elem.rectangle;
        if(this.img==null){
            this.img=new Image();
            this.img.width='100%'
            this.img.height='100%'
            this.img.src=elem.content.src;
        }
        ctx.drawImage(this.img,rect.x,rect.y);
    }
}

