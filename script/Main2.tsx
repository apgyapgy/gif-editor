import * as React from 'react';
import Upload from './Upload'
import Editor from "./editor/Editor";
import Help from "./Help";
import {updateIframe} from "./utils/utils";
import {gif} from "./editor/Gif";
import {postJson} from "./utils/api";

export default class Main extends React.Component<any,any> {
    constructor(props) {
        super(props);
        this.state = {vm: null}
        updateIframe(2250)
        gif.onUploaded = this.onUploaded
        this.postData()
    }

    onLoaded = (vm) => {
        this.setState({vm: vm});
        let cur = document.body.scrollTop;
        let ctrl = setInterval(() => {
            if (cur < 100) {
                cur += 10;
                document.body.scrollTop = cur;
            } else clearInterval(ctrl);
        }, 5);
        updateIframe(900)
    }

    postData = () => {
        let data = `data:image/gif;base64,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`
        postJson('/api/up', {Data: data}).then((json: any) => {
            if (json.Msg) {
                console.log('err', json.Msg)
            } else {
                this.setState({status: 'ok', startText: ''})
                this.onLoaded(json)
            }
        })
    }
    onUploaded = (data) => {
        console.log(data)
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