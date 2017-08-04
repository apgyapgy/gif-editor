import * as React from 'react';
import * as classNames from 'classnames';
import {gif} from './Gif'
import Speed from "./Speed";
import Effects from "./Effects";
import {isSafari} from "../utils/utils";
import {updateIframe} from "../utils/utils";

const colors = ['#000', '#fff', '#ed5557', '#f4e525', '#6635fb', '#43f56a', '#3ac1f9', '#e05f15',"#07e9c8"]
const styles = ['汉真广标', '华康布丁', '新青年体','仿宋','娃娃体']
const weffects = ['无状态','放大缩小','突然闪现','上下波动','排队出来','rainbow']

const TxtInput = ({val, onChange, idx, sel, last, onFocus, onBtn}) => {
    return <div className={classNames('input-wrap',{'selected':sel})}>
        <input value={val} onChange={onChange} onFocus={onFocus} placeholder="输入想要添加的文字"/>
        <div className="btn" onClick={onBtn}/>
    </div>
}
const Inputs = ({lst, cur, onChange, onFocus, onBtn}) =><div className="inputs">
    {lst.map((x, i) =><TxtInput val={x} onChange={e=>onChange(i,e)} onFocus={e=>onFocus(i)} onBtn={()=>onBtn(i)} idx={i}
                                sel={cur==i} last={false} key={i}/>)}
</div>

const Weffects = ({curEffect,onWeffects}) => <div className="weffects">
	<span className="title">动效</span>
	{weffects.map((x,i)=><span className={classNames('weffect','weffect'+i,{'selected':curEffect==i})} key={i} onClick={()=>onWeffects(i)}>{x}</span>)}
</div>

const Colors = ({color, onColor}) =><div className="colors">
    <span className="title">颜色</span>
    {colors.map((x, i) =><span className={classNames('color',{'selected':color==i})} style={{backgroundColor:x}}
                               key={i} onClick={()=>onColor(i)}/>)}
</div>

const Styles = ({curStyle, onStyle}) =><div className="styles">
    <span className="title">字体</span>
    {styles.map((x, i) =><span className={classNames('style','style'+i,{'selected':curStyle==i})}
                               key={i} onClick={()=>onStyle(i)}>{x}</span>)}
</div>

const Borders = ({hasBorder, onBorder}) =><div className="borders">
    <span className="title">边框</span>
    <span className={classNames('border',{'selected':hasBorder})} onClick={onBorder}>黑色边框</span>
</div>

const Orders = ({lst, order, onOrder}) =><div className="orders">
    {lst.map((x, i) =><span className={classNames('order','order'+i,{'selected':order==i})} onClick={()=>onOrder(i)}>
        <span>{x}</span>
    </span>)}
</div>

export default class Setting extends React.Component<any,any> {

    constructor(props) {
        super(props);
        this.state = {curTab: 1, color: 0, curStyle: 0,curEffect:0, down: false}
        gif.onChanged = () => {
            this.setState({})
        }
        gif.onImgChanged = () => this.setState({curTab: 1})
    }

    onGifChanged = () => {
        this.setState({})
    }
    onSelect = (val) => {
    	let _select = ['文字','滤镜','特效'];
        this.setState({curTab: val});
        if(val == 1){
        	updateIframe(1050);
        }else if(val == 2){
        	updateIframe(920);
        }else if(val == 3){
        	updateIframe(960);
        }
        _hmt.push(['_trackEvent'],'gif编辑','click',_select[val]);
        this.props.onTab(val);
    }

    getClass = (val) => 'tab tab' + val + (this.state.curTab == val ? ' selected' : '');

    download = () => {
        this.setState({down: true})
        gif.gen(this.cb)
        _hmt.push(['_trackEvent'],'gif编辑','click','生成并下载');
    }

    cb = (url, url2) => {
        if (gif.onUploaded) {
            this.setState({down: false})
            return
        }
        if (isSafari()) {
            this.setState({down: false})
            window.location.href = '/api/up?file=' + url2;
            return;
        }
        let save_link = document.createElementNS('http://www.w3.org/1999/xhtml', 'a');
        save_link['href'] = url;
        save_link['download'] = "";
        let event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        save_link.dispatchEvent(event);
        this.setState({down: false})
    }

    render() {
        const {curTab, color, curStyle,curEffect, down}=this.state;
        let ti = gif.textInfo;
        return <div className='setting'>
            <div className="header">
                <span className={this.getClass(1)} onClick={()=>this.onSelect(1)}><span className="txt">文字</span></span>
                <span className={this.getClass(2)} onClick={()=>this.onSelect(2)}><span className="txt">滤镜</span></span>
                <span className={this.getClass(3)} onClick={()=>this.onSelect(3)}><span className="txt">特效</span></span>
            </div>
            <div className="tabs">
                {curTab == 1 ?<div className="tab1">
                        <Inputs lst={ti.lst} cur={ti.cur} onChange={(i,e)=>gif.setTxt(i,e.target.value)}
                                onFocus={(i)=>gif.setFocus(i)} onBtn={i=>gif.onTxtBtn(i)}/>
                        <Colors color={ti.color} onColor={gif.setColor}/>
                        <Styles curStyle={ti.style} onStyle={gif.setStyle}/>
                        <Weffects curEffect={ti.curEffect}  onWeffects={gif.setWeffects}/>
                        <Borders hasBorder={gif.border} onBorder={gif.toggleBorder}/>
                    </div>: curTab == 2 ?<div className="tab2">
                            <Effects curTab={curTab} val={ti.effect} onEffect={gif.setEffect}/>
                        </div>:
                        <div className="tab3">
                            <div className="title">播放速度</div>
                            <Speed val={ti.speed} onSpeed={val=>gif.setSpeed(val)}/>
                            <div className="title">播放效果</div>
                            <Orders lst={["正常",'倒放','反复']} order={ti.order} onOrder={i=>gif.setOrder(i)}/>
                        </div>}
            </div>
            <div className="tabType">
            	<div className="tabTitle">
            		<p>标签分类</p>
            		<span>为动图填写标签，将有趣的gif分享给更多的人</span>
            	</div>
            	<div className="tabInput">
            		<input id="tab" placeholder="多个标签之间用逗号隔开，每个标签不要超过6个字"/>
            	</div>
            </div>
            <div className={classNames("download",{'ing':down})} onClick={this.download}>
                <div className="loader"></div>
                <span>生成并下载GIF</span>
            </div>
        </div>
    }
}