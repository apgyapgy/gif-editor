import {Movie} from "../jb2d/Movie";
import ImgElem from "../jb2d/elems/ImgElem";
import TextElem from "../jb2d/elems/TextElem";
import BorderElem from "../jb2d/elems/BorderElem";
import {putJson} from "../utils/api";
import {Element} from '../jb2d/Element';
import {isSafari} from "../utils/utils";

export class Gif {
    maxW = 924;
    maxH = 265;
    g: Movie = null;
    onChanged = null;
    onImgChanged = null;
    elemBorder;
    elemText: Element[] = [];
    curElemText: number;
    trans;
    transColor;
    canvas
    vm
    scale = 1;
    effect = 0;
    onUploaded = null;

    checkScale() {
        if (this.vm.Width / this.vm.Height > this.maxW / this.maxH) {
            this.scale = this.maxW / this.vm.Width
        } else {
            this.scale = this.maxH / this.vm.Height
        }
    }

    reset = (vm, canvas) => {
        this.vm = vm;
        if (this.g) this.g.dispose();
        this.checkScale();

        canvas.width = vm.Width * this.scale;
        canvas.height = vm.Height * this.scale;
        this.elemText = [];
        this.canvas = canvas;
        this.g = new Movie(canvas, vm.Frames.length, vm.Width * this.scale, vm.Height * this.scale, this.scale);
        this.g.context.scale(this.scale, this.scale);
        this.g.theme = {background: "#fff", selection: "#888"};
        this.trans = vm.Trans;
        this.transColor = vm.TransColor;
        for (let i = 0; i < vm.Frames.length; i++) {
            let imgElem = new ImgElem();
            imgElem.resizable = false;
            let el = this.g.addFrameElem(imgElem, {x: 0, y: 0}, {src: vm.Frames[i].Data,_index:i}, i);
            el.selectable = false;
        }
        this.g.effectCount(vm.Frames.length);
        this.elemBorder = this.g.addFrameElem(new BorderElem(), {x: 0, y: 0}, null, false);
        this.elemBorder.rectangle.width = vm.Width;
        this.elemBorder.rectangle.height = vm.Height;
        this.elemBorder.selectable = false;
        this.addTxtElem();
        this.curElemText = -1;
        this.effect = 0;
        setTimeout(() => {
            this.g.play();
            if (this.onImgChanged)
                this.onImgChanged()
        }, 2000);

    }
    addTxtElem = (txt: string = '') => {
        if (this.elemText.length > 1) return;
        let el = this.g.addFrameElem(new TextElem(), {
            x: this.vm.Width / 2 - 90,
            y: this.vm.Height / 2 - 18
        }, {text: txt, color: 1, style: 0,curEffect:0,showFlag:true,showCount:0,high:8,highCount:0,size:[0,4],count:0,fadePos:'',single:0,aq:0,rainbow:0}, true);
        if (el.rectangle.x < 0) {
            el.rectangle.x = 4;
            el.rectangle.width = this.vm.Width - 8;
        }

        this.elemText = this.elemText.concat(el);
        this.curElemText = this.elemText.length - 1;
        if (this.curElemText == 1) {
            el.rectangle.y += 36;
        }
    }
    callOnChanged = () => {
        if (this.onChanged) this.onChanged()
    }

    toggleBorder = () => {
        this.elemBorder.frames = !this.elemBorder.frames;
        if(this.elemBorder.frames){
        	_hmt.push(['_trackEvent'],'gif编辑','click','黑色边框');
        }
        this.callOnChanged();
    }
    setOrder = (n: number) => {
    	let _order = ['正常播放','倒序播放','反复播放'];
        this.g.order = n;
        this.callOnChanged();
        _hmt.push(['_trackEvent'],'gif编辑','click',_order[n]);
    }
    setSpeed = (n: number) => {
    	let _speed = ['速度0.1X','速度0.5X','速度1X','速度2X','速度3X'];
        this.g.delay = n;
        this.callOnChanged();
        _hmt.push(['_trackEvent'],'gif编辑','click',_speed[n]);
    }
    setColor = (n: number) => {
    	let _color = ['#000', '#fff', '#ed5557', '#f4e525', '#6635fb', '#43f56a', '#3ac1f9', '#e05f15',"#07e9c8"];
        this.elemText[this.curElemText].content.color = n;
        this.callOnChanged();
        _hmt.push(['_trackEvent'],'gif编辑','click',_color[n]);
    }
    setWeffects = (n:number) => {
    	let _weffect = ['无状态','放大缩小','突然闪现','上下波动','排队出来','rainbow'];
    	_hmt.push(['_trackEvent'],'gif编辑','click',_weffect[n]);
    	this.elemText[this.curElemText].content.curEffect = n;
    	if(n == 1){//放大缩小
    		this.elemText[this.curElemText].content.size = [0,4];
    	}else if(n == 2){//突然闪现
    		this.elemText[this.curElemText].content.showFlag = true;
    	}else if(n == 3){//上下波动
    		this.elemText[this.curElemText].content.high = 5;
    	}else if(n == 4){//排除出来
    		this.elemText[this.curElemText].content.fadePos = "";
    		this.elemText[this.curElemText].content.count = 0;
    		this.elemText[this.curElemText].content.single = 0;
    	}
    	this.callOnChanged();
    }
    setStyle = (n: number) => {
    	let _style = ['汉真广标', '华康布丁', '黑体','仿宋','娃娃体'];
    	_hmt.push(['_trackEvent'],'gif编辑','click',_style[n]);
        this.elemText[this.curElemText].content.style = n;
        this.callOnChanged();
    }
    setTxt = (n: number, txt: string) => {
        this.curElemText = n;
        this.elemText[this.curElemText].content.text = txt;
        this.callOnChanged();
        _hmt.push(['_trackEvent'],'gif编辑','click','输入文字');
    }
    setFocus = (n: number) => {
        this.curElemText = n;
        this.callOnChanged();
    }
    setEffect = (n: number, fun) => {
    	let _effect = ['无滤镜','黑白','模糊','马赛克','鲜艳','反色','艺术'];
        this.effect = n;
        this.g.effect(fun);
        this.callOnChanged();
        _hmt.push(['_trackEvent'],'gif编辑','click',_effect[n]);
    }
    onTxtBtn = (n: number) => {
        if (n == 0) {
            this.addTxtElem();
            _hmt.push(['_trackEvent'],'gif编辑','click','点击加号');
        } else {
            let el = this.elemText[n];
            this.elemText.splice(n, 1);
            el.remove()
            this.curElemText = n - 1;
            _hmt.push(['_trackEvent'],'gif编辑','click','点击删除');
        }
        this.callOnChanged();
    }

    get textInfo() {
        if (this.elemText.length == 0) {
            return {
                lst: [''],
                cur: null,
                color: -1,
                style: -1,
                curEffect:-1,
                order: 0,
                speed: 2,
                effect: 0,
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
            }
        }
        let c = this.curElemText;
        return {
            lst: this.elemText.map(x => x.content.text),
            cur: c,
            order: this.g.order,
            speed: this.g.delay,
            effect: this.effect,
            color: c == -1 ? -1 : this.elemText[c].content.color,
            style: c == -1 ? -1 : this.elemText[c].content.style,
            curEffect:c == -1?-1:this.elemText[c].content.curEffect,
            showFlag:c==-1?true:this.elemText[c].content.showFlag,
            showCount:c==-1?0:this.elemText[c].content.showCount,
            size:c == -1?[0,4]:this.elemText[c].content.size,
            high:c==-1?8:this.elemText[c].content.high,
            highCount:c==-1?0:this.elemText[c].content.highCount,
            count:c==-1?0:this.elemText[c].content.count,
            fadePos:c==-1?"":this.elemText[c].content.fadePos,
            single:c==-1?0:this.elemText[c].content.single,
            aq:c==-1?0:this.elemText[c].content.aq,
            rainbow:c==-1?0:this.elemText[c].content.rainbow
        }
    }

    get border() {
        return this.elemBorder && this.elemBorder.frames;
    }

    gen = (cb) => {
        let data = this.g.getData();
        data['IsSafari'] = isSafari()
        /*putJson('/api/up', data).then(json => {
            if (this.onUploaded) {
                this.convertFileToDataURLviaFileReader(json['Url'], data => {
                    this.onUploaded(data)
                    cb(json['Url'], json['Url2']);
                })
            }
            else cb(json['Url'], json['Url2']);
        })*/
        putJson('/api/up', data).then(json => {
            cb(json['Url']);
        });
    }

    convertFileToDataURLviaFileReader(url, callback) {
        let xhr = new XMLHttpRequest();
        xhr.onload = function () {
            let reader = new FileReader();
            reader.onloadend = function () {
                callback(reader.result);
            }
            reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    }

    getArray = (len, num) => {
        let vals = [];
        if (this.g == null) return vals;
        for (let i = 0; i < len; i++) {
            vals.push(num)
        }
        return vals;
    }
    zeroArray = (len) => this.getArray(len, 0);
    oneArray = (len) => this.getArray(len, 1);
}

export const gif = new Gif();

