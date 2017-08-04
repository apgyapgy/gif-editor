import {Element} from '../Element';
//const colors=['#010101','#ffffff','#EC7470','#FFED67','#855EFD','#7DF497','#D263B8','#58CBFB']
const colors = ['#000', '#fff', '#ed5557', '#f4e525', '#6635fb', '#43f56a', '#3ac1f9', '#e05f15',"#07e9c8"];
export class TextElemProps{
    text:string="";
    color:number=0;
    style:number=0;
    curEffect:number = 0;
    showFlag:boolean=true;
    showCount:number = 0;
    high:number = 8;
    highCount:number = 0;
    size:number[] = [0,4];
    count:number = 0;
    fadePos:string = "";
    single:number = 0;
    aq:number = 0;
    rainbow:number = 0;
}

export default class TextElem {
    resizable = true;
    defaultWidth = 180;
    defaultHeight = 36;
    defaultContent: TextElemProps = {
    	text: '',
    	color:0,
    	style:0,
    	curEffect:0,
    	showFlag:true,
    	showCount:0,
    	high:8,
    	highCount:0,
    	size:[0,4],
    	count:0,
    	fadePos:"",
    	single:0,
    	aq:0,
    	rainbow:0
    };
    paint = (elem, ctx) => {
    	//console.log("text paint");
        let rect = elem.rectangle;
        let cnt=elem.content;
        let _font;
        let font=rect.height+ "px hanzhen";
        if(cnt.style==0){
        	font=rect.height+ "px hanzhen";
        	_font = 'hanzhen';
        }else if(cnt.style==1) {
        	font=rect.height+ "px huakang";
        	_font = 'huakang';
        }else if(cnt.style == 2){
        	//font=rect.height+ "px xinqingnian";
        	font="bold "+rect.height+ "px STHeiti";
        	_font = 'xinqingnian';
        }else if(cnt.style == 3){
        	//font=rect.height+ "px zhunyuan";
        	font=rect.height+ "px 'FangSong'";
        	_font = 'zhunyuan';
        }else if(cnt.style == 4){
        	font=rect.height+ "px wawati";
        	_font = 'wawati';
        }
        ctx.lineWidth = 2;
        ctx.font = font;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
		ctx.fillStyle = elem.content.color == 0?"#666":"#515151";
		if(cnt.curEffect == 5){ //彩虹
			let rans = ["#ff7d7f","#ffff7e","#72ff72","#7dffff","#7f7ffb","#fe7ffe"];
			ctx.fillText(elem.content.text, rect.x + (rect.width / 2)+1, rect.y+ rect.height/2+1 );
			ctx.fillStyle =rans[cnt.rainbow];
			cnt.rainbow++;
			if(cnt.rainbow == rans.length){
				cnt.rainbow = 0;
			}
			ctx.fillText(elem.content.text, rect.x + (rect.width / 2), rect.y+ rect.height/2);
		}else if(cnt.curEffect ==1){//放大缩小
			ctx.font = (rect.height + cnt.size[0]) + 'px '+_font;
			ctx.fillText(elem.content.text, rect.x + (rect.width / 2)+1, rect.y+ rect.height/2+1 );
        	ctx.fillStyle =colors[elem.content.color];
			ctx.fillText(elem.content.text, rect.x + (rect.width / 2), rect.y+ rect.height/2);
		}else if(cnt.curEffect ==2){//突然闪现
			if(cnt.showFlag){
				ctx.fillText(elem.content.text, rect.x + (rect.width / 2)+1, rect.y+ rect.height/2+1);
        		ctx.fillStyle =colors[elem.content.color];
				ctx.fillText(elem.content.text, rect.x + (rect.width / 2), rect.y+ rect.height/2 );
			}
		}else if(cnt.curEffect ==3){//上下波动
			ctx.fillText(elem.content.text, rect.x + (rect.width / 2)+1, rect.y+ rect.height/2+cnt.high+1);
        	ctx.fillStyle =colors[elem.content.color];
			ctx.fillText(elem.content.text, rect.x + (rect.width / 2), rect.y+ rect.height/2+cnt.high );
		}else if(cnt.curEffect == 4){//排队出来
			ctx.textAlign = "left";
			var _left = Math.floor(ctx.measureText(elem.content.text).width/2);
			ctx.fillText(elem.content.fadePos,rect.x + (rect.width / 2) - _left+1, rect.y+ rect.height/2+1);
        	ctx.fillStyle =colors[elem.content.color];
			ctx.fillText(elem.content.fadePos,rect.x + (rect.width / 2) - _left, rect.y+ rect.height/2 );
		}else if(cnt.curEffect ==0){//无状态
			ctx.fillText(elem.content.text, rect.x + (rect.width / 2)+1, rect.y+ rect.height/2+1);
        	ctx.fillStyle =colors[elem.content.color];
			ctx.fillText(elem.content.text, rect.x + (rect.width / 2), rect.y+ rect.height/2 );
		}
    }

    selectable=(elem, ctx)=>{
        return elem.content.text!=''
    }

}

