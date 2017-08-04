import * as React from 'react';
import * as classNames from 'classnames';

export default class Speed extends React.Component<any,any> {
    down = false;
    refs: {
        [key: string]: (Element);
        bar: (HTMLElement);
        tip: (HTMLElement);
    }

    constructor(props) {
        super(props);
        this.state = {x: 0, left: 0}
    }

    onDown = (e) => {
        this.down = true;
        this.setState({x: e.clientX, left: this.props.val * 117})
    }
    onUp = (e) => {
        const {x, left}=this.state;
        if (!this.down)return;
        this.down = false;
        let next = this.props.val + Math.round((e.clientX - x) / 117);
        next = next < 0 ? 0 : next > 4 ? 4 : next;
        let to = 117 * next + 5
        this.refs.bar.style.left = to + '';
        this.props.onSpeed(next)
    }
    onMove = (e) => {
        const {x, left}=this.state;
        if (!this.down) return;
        let to = left + e.clientX - x;
        if (to < 4 || to > 472) return;
        this.refs.bar.style.left = to + '';
    }

    render() {
        const {val, onSpeed}=this.props;
        const tipStrs = ['0.1x', '0.5x', '1x', '2x', '3x']
        let posLeft = {'left': 117 * val + 5}

        return <div className='speed' onMouseLeave={this.onUp} onMouseUp={this.onUp}>
            <div className="bar" ref="bar" style={posLeft} onMouseDown={this.onDown} onMouseUp={this.onUp}
                 onMouseMove={this.onMove}></div>
            <div className="tips">
                {tipStrs.map((x, i) =><div className={classNames("tip",{'active':val==i})} onClick={x=>onSpeed(i)} style={{left:117 * i + 5}}>
                    {val == i ? x : ''}
                </div>)}
            </div>
        </div>
    }
}