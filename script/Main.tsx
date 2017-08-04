import * as React from 'react';
import Upload from './Upload'
import Editor from "./editor/Editor";
import Help from "./Help";
import {updateIframe} from "./utils/utils";

export default class Main extends React.Component<any,any> {
    constructor(props) {
        super(props);
        this.state = {vm: null}
        updateIframe(2300)
    }

    onLoaded = (vm) => {
        this.setState({vm: vm});
        let cur = document.body.scrollTop;
        /*let ctrl = setInterval(() => {
            if (cur < 100) {
                cur += 10;
                document.body.scrollTop = cur;
            } else clearInterval(ctrl);
        }, 5);*/
        updateIframe(1050)
    }

    render() {
        const {vm}=this.state;
        return <div>
            <img id="f1" src="/static/images/f1.png"/>
            <img id="f2" src="/static/images/f2.png"/>
            <div className="editor-wrap">
                <div className="content">
                    <Upload onLoaded={this.onLoaded}/>
                </div>
            </div>
            <Editor vm={vm}/>
            {vm == null ?<Help/>: null}
        </div>
    }
}