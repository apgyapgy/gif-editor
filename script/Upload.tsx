import * as React from 'react';
import {Upload} from "antd";
import {isWebUri} from "./utils/uri";
import * as classNames from 'classnames';
import {postJson} from "./utils/api";

export default class UploadGif extends React.Component<any,any> {
    constructor(props) {
        super(props);
        this.state = {status: '', msg: '', url: '', startText: '开始制作', shake: '', process: 0};
    }

    onErr = (msg) => {
        this.setState({
            status: 'err',
            startText: '',
            msg: msg,
            shake: 'shake shake-horizontal shake-constant',
            process: 0
        })
        setTimeout(() => {
            this.setState({shake: ''})
        }, 400);
    }

    beforeUpload = (file, fileList?): boolean | Promise<any> => {
        if (!file.name.endsWith(".gif")) {
            this.onErr("只能上传GIF图片")
            return false;
        }
        return true;
    }

    onUploaded(data) {
        let status = data.file.status;
        if (status == 'uploading') {
            this.setState({status: 'ing', startText: '', process: data.file.percent})
        }
        else if (data.file.status == 'done') {
            let m = data.file.response;
            if (m.Msg) {
                this.onErr(m.Msg)
            } else {
                this.setState({status: 'ok', startText: '', url: '', process: 0})
                this.props.onLoaded(data.file.response)
            }
        }
        _hmt.push(['_trackEvent'],'gif编辑','click','本地上传');
    }

    onInputChange = (e) => {
        this.setState({url: e.target.value, status: '', startText: '开始制作'})
    }
    onKeyPress = (e) => {
        if (e.charCode == 13) {
            this.onStart()
        }
    }
    onStart = () => {
        const {url}=this.state;
        if (url.trim() === '') {
            this.onErr('图片地址不能为空')
            return;
        } else if (!isWebUri(url.trim())) {
            this.onErr('无法识别图片来源')
            return;
        }
        postJson('/api/up', {Url: url}).then((json: any) => {
            if (json.Msg) {
                this.onErr(json.Msg)
            } else {
                this.setState({status: 'ok', startText: ''})
                this.props.onLoaded(json)
            }
        })
        this.setState({status: 'ing', startText: ''})
        _hmt.push(['_trackEvent'],'gif编辑','click','开始制作');
    }

    render() {
        const props = {
            action: '/api/up',
            showUploadList: false
        };
        const {status, startText, url, msg, shake, process}=this.state;

        let cls = classNames('wrap', shake)

        return <div id="upload" className={status}>
            <div className={cls}>
                <input value={url} onKeyPress={this.onKeyPress} onChange={this.onInputChange} className="url"
                       placeholder="右键点击gif选择复制图片地址粘贴到搜索框，或点击本地上传"/>
                <Upload {...props} onChange={e=>this.onUploaded(e)} beforeUpload={this.beforeUpload} accept="image/gif">
                    <span className="up">本地上传</span>
                </Upload>
            </div>
            <div className="start" onClick={this.onStart}>
                <div className="loader"></div>
                {startText}</div>
            {status == 'err' ? <div className="msg"><span>{msg}</span></div>: null}
        </div>
    }
}