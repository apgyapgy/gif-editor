import * as React from 'react';

export default class Help extends React.Component<any,any> {
    constructor(props) {
        super(props);
        this.state = {show: false}
    }

    onShowHelp = () => {
        let cur = document.body.scrollTop;
        let ctrl = setInterval(() => {
            if (cur < 600) {
                cur += 10;
                document.body.scrollTop = cur;
            } else clearInterval(ctrl);
        }, 5);
    }

    render() {
        return <div className="help">
            <div id="btn-help">
                <img id='helpbtn' src="/static/images/helpbtn.png"/>
            </div>
            <div id="help">
                <img id="hp1" src="/static/images/help1.png"/>

                <img id="g3" src="/static/images/help2.png"/>
                <img id="g30" src="/static/images/g3.png"/>
                <img id="g31" src="/static/images/help5.png"/>
                <img id="g32" src="/static/images/help6.png"/>
                <img id="g34" src="/static/images/1.gif"/>
                <img id="g33" src="/static/images/g42.png"/>

                <img id="g4" src="/static/images/help2.png"/>
                <img id="g40" src="/static/images/g4.png"/>
                <img id="g43" src="/static/images/g43.png"/>
                <img id="g41" src="/static/images/g41.png"/>
                <img id="g42" src="/static/images/g42.png"/>
                <img id="g44" src="/static/images/g44.png"/>
                <img id="g45" src="/static/images/2.gif"/>

                <img id="g5" src="/static/images/help2.png"/>
                <img id="g50" src="/static/images/g5.png"/>
                <img id="g51" src="/static/images/g51.png"/>
                <img id="g55" src="/static/images/3.png"/>
                <img id="g52" src="/static/images/g52.png"/>
                <img id="g53" src="/static/images/g53.png"/>
                <img id="g54" src="/static/images/g54.png"/>

                <img id="hp99" src="/static/images/help10.png"/>
                <div className="preloadfont">
                	<div className="hanzhen">汉真广标</div>
                	<div className="huakang">华康布丁</div>
                	<div className="wawati">娃娃体</div>
                </div>
            </div>
        </div>
    }
}