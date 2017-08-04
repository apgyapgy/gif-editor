import * as React from 'react';
import * as classNames from 'classnames';
import {gif} from './Gif'

class CanvasComponent extends React.Component<any,any> {
    refs: {
        [key: string]: (Element);
        canvas: (HTMLCanvasElement);
    }
    componentWillReceiveProps(nextProps) {
        this.updateCanvas();
    }
    componentDidMount() {
        this.updateCanvas();
    }
    componentDidUpdate() {
        this.updateCanvas();
    }
    updateCanvas() {
        if (gif.vm == null) return;
        const ctx = this.refs.canvas.getContext('2d');
        let img = new Image();
        img.src = gif.vm.Frames[0].Data;
        let w = gif.vm.Width, h = gif.vm.Height, sx = 0, sy = 0, sw = 0;
        if (w > h) {
            sx = (w - h) / 2;
            sw = h;
            ctx.drawImage(img, sx, sy, sw, sw, 0, 0, 120, 120);
        } else if (w < h) {
            sy = (h - w) / 2;
            sw = w;
            ctx.drawImage(img, sx, sy, sw, sw, 0, 0, 120, 120);
        } else ctx.drawImage(img, 0, 0,120,120);
        this.props.filter(this.refs.canvas, ctx)
    }
    render() {
        return <canvas ref="canvas" width={120} height={120}/>
    }
}

export default class Effects extends React.Component<any,any> {

    constructor(props) {
        super(props);
        this.state = {}
    }

    get all() {
        return [
            {label: '无滤镜', fun: noon},
            {label: '黑白', fun: gray},
            {label: '模糊', fun: blur},
            {label: '马赛克', fun: mosaic},
            // {label: '油画', fun: oilPaint},
            {label: '鲜艳', fun: brightness},
            {label: '反色', fun: invert},
            {label: '艺术', fun: emboss},
        ];
    }

    render() {
        const {val,onEffect,src}=this.props;

        return <div className='effects'>
            {this.all.map((x, i) =><div className={classNames('effect',{'selected':val==i})} onClick={()=>onEffect(i,x.fun)}>
                <CanvasComponent filter={x.fun}/>
                <span>{x.label}</span>
            </div>)}
        </div>
    }
}

const noon=(canvas,ctx)=>{}

function gray(canvas,ctx) { //黑白
    let pixels=ctx.getImageData(0,0,canvas.width,canvas.height);
    let d = pixels.data;
    for (let i=0; i<d.length; i+=4) {
        let r = d[i];
        let g = d[i+1];
        let b = d[i+2];
        let v = 0.2126*r + 0.7152*g + 0.0722*b;
        d[i] = d[i+1] = d[i+2] = v;
    }
    ctx.putImageData(pixels,0,0);
}

function invert(canvas,ctx){
    let imageData =ctx.getImageData(0,0,canvas.width,canvas.height);
    let pixels = imageData.data;
    for (let i = 0; i < pixels.length; i++) {
        pixels[i*4] = 255-pixels[i*4]; // Red
        pixels[i*4+1] = 255-pixels[i*4+1]; // Green
        pixels[i*4+2] = 255-pixels[i*4+2]; // Blue
    }
    ctx.putImageData(imageData,0,0);
}

function brightness(canvas,ctx){
    let imageData =ctx.getImageData(0,0,canvas.width,canvas.height);
    let pixels = imageData.data;
    let add=20;
    for (let i = 0; i < pixels.length; i+=4) {
        pixels[i*4] = pixels[i*4]+add; // Red
        pixels[i*4+1] = pixels[i*4+1]+add; // Green
        pixels[i*4+2] = pixels[i*4+2]+add; // Blue
    }
    ctx.putImageData(imageData,0,0);
}
function oilPaint(canvas,ctx){
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;

    let w=imageData.width,h=imageData.height;

    let iModel = 2;
    let i = w - iModel;
    while (i > 1)
    {
        let j = h - iModel;
        while (j > 1)
        {
            let iPos = Math.ceil(Math.random()*iModel)+1;
            j = j - 1;
        }
        i = i - 1;
    }

    ctx.putImageData(imageData, 0, 0);
}
function emboss(canvas,ctx){
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;
    let lastR= pixels[0],lastG= pixels[1],lastB= pixels[2];
    for (let i=1;i<imageData.width-1;i++){
        for (let j=1;j<imageData.height-1;j++){
            let currentPixel = 4*imageData.width*j + 4* i;
            let r = pixels[currentPixel],
                g = pixels[currentPixel+1],
                b = pixels[currentPixel+2];
            pixels[currentPixel] +=(128-lastR);
            pixels[currentPixel+1] +=(128-lastG);
            pixels[currentPixel+2] +=(128-lastB);
            lastR = r;
            lastG = g;
            lastB = b;
        }
    }
    ctx.putImageData(imageData, 0, 0);
}
const mosaic=(canvas,ctx)=> {
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let pixels = imageData.data;
    let tileWidth =  4;
    let w=canvas.width,h=canvas.height;
    if (w>=h){
        tileWidth=Math.round(w/40);
    }else {
        tileWidth=Math.round(h/40)
    }

    for (let r = 0; r < imageData.height; r += tileWidth)
        for (let c = 0; c < imageData.width; c += tileWidth) {
            let tl = (r * imageData.width + c) * 4;
            for (let tr = 0; tr < tileWidth; tr++)
                for (let tc = 0; tc < tileWidth; tc++) {
                    if (tr == 0 && tc == 0) continue;
                    if (r+tr>=h) continue;
                    if (c+tc>=w) continue;
                    let ps = ((r + tr) * imageData.width + (c + tc)) * 4;
                    for (let x = 0; x < 3; x++)
                        pixels[ps + x] = pixels[tl + x];
                }
        }
    ctx.putImageData(imageData, 0, 0);
}

const blur=(canvas,ctx) =>{ //模糊
    let weights=[1/9,1/9,1/9,
        1/9,1/9,1/9,
        1/9,1/9,1/9];
    filter(canvas,ctx,weights);
}
const filter=(canvas,ctx,weights)=>{
    var side = Math.round(Math.sqrt(weights.length));
    var halfSide = Math.floor(side/2);
    var pixels=ctx.getImageData(0,0,canvas.width,canvas.height);
    var src= pixels.data;
    var sw = pixels.width;
    var sh = pixels.height;
    var w = sw;
    var h = sh;

    var dst = pixels.data;
    var opaque=1;
    var alphaFac = opaque ? 1 : 0;
    for (var y=0; y<h; y++) {
        for (var x=0; x<w; x++) {
            var sy = y;
            var sx = x;
            var dstOff = (y*w+x)*4;
            //将canvas元素中的像素数组与变换矩阵数组进行相乘运算
            var r=0, g=0, b=0, a=0;
            for (var cy=0; cy<side; cy++) {
                for (var cx=0; cx<side; cx++) {
                    var scy = sy + cy - halfSide;
                    var scx = sx + cx - halfSide;
                    if (scy >= 0 && scy < sh && scx >= 0 && scx < sw) {
                        var srcOff = (scy*sw+scx)*4;
                        var wt = weights[cy*side+cx];
                        r += src[srcOff] * wt;
                        g += src[srcOff+1] * wt;
                        b += src[srcOff+2] * wt;
                        a += src[srcOff+3] * wt;
                    }
                }
            }
            dst[dstOff] = r;
            dst[dstOff+1] = g;
            dst[dstOff+2] = b;
            // dst[dstOff+3] = a + alphaFac*(255-a);
        }
    }
    //将经过运算后的像素数组输出到canvas元素中
    ctx.putImageData(pixels,0,0);
}