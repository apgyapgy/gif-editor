import * as React from 'react';
import {gif} from './Gif'
import * as classNames from 'classnames';
import Setting from "./Setting";

export default class Editor extends React.Component<any,any> {
    refs: {
        [key: string]: (Element);
        canvas: (HTMLCanvasElement);
    }

    g = null;

    constructor(props) {
        super(props);
        this.state = {vm: null, curTab: 0}
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

    componentWillReceiveProps(nextProps) {
        let vm = nextProps.vm;
        if (vm) {
            gif.reset(vm, this.refs.canvas);
        }
    }

    getCanvasCls = () => {
        const {vm}=this.props
        if (!vm) return;

        if (vm.Height < 265) return 'small'
    }
    onLeave = () => {
        if (gif.g)
            gif.g.noSelection();
    }

    render() {
        const {vm}=this.props
        let g2Class = classNames({
            'hide': vm != null
        })
        let editorClass = classNames('editor-main', {
            'move': vm != null
        })
        let canvasClass = classNames('canvas', this.getCanvasCls())

        return <div className="editor-wrap">
            {vm ?<div className="tip2">
                    <p className={classNames('title',{'tip1':this.state.curTab==1})}>TIP:</p>
                    <p className="body">{this.state.curTab == 2 ? '试试“马赛克”效果' : this.state.curTab == 3 ?'试试速度调到最快':'文字可以当水印用哟'}</p>
                </div>: null}
            <div className='editor content'>
                <div className={editorClass}>
                    <canvas ref="canvas" id="canvas" className={canvasClass} onMouseLeave={this.onLeave}/>
                </div>
                <div id="g2" className={g2Class}>
                    <img id="g25" src="/static/images/g25.png"/>
                    <img id="g24" src="/static/images/g24.png"/>
                </div>
            </div>
            {vm ?<Setting onTab={n=>this.setState({curTab:n})}/>: null}
        </div>
    }
}