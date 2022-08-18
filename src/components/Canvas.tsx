import { Component, createRef, MouseEvent, RefObject } from 'react';
import { Button } from 'react-bootstrap';

class Canvas extends Component<any, any> {
    static WIDTH: number = 106;
    static HEIGHT: number = 17;
    canvas: RefObject<HTMLCanvasElement>;

    constructor(props: any) {
        super(props);
        this.canvas = createRef();

        this.state = {
            showGrid: false,
            painting: false,
            blend: true,
            scale: Math.round(document.documentElement.clientWidth / Canvas.WIDTH) * 2,
            lastX: 0,
            lastY: 0
        };

        this.draw = this.draw.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleMouseDown = this.handleMouseDown.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    componentDidMount() {
        if (this.props.pixels.length > 0) {
            this.draw();
        }

        document.addEventListener('keyup', this.handleKeyUp);
    }

    componentDidUpdate() {
        if (this.props.pixels.length > 0) {
            this.draw();
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keyup', this.handleKeyUp);
    }

    draw() {
        const canvas = this.canvas.current;
        if (!canvas) return console.error('Canvas not found');

        let scale = this.state.scale;

        canvas.width = Canvas.WIDTH * scale + 2;
        canvas.height = Canvas.HEIGHT * scale + 2;

        const ctx = canvas.getContext('2d');
        if (!ctx) return console.error('Could not get context');

        if (this.state.showGrid) {
            ctx.fillStyle = '#ccc';

            //draw grid 106x17 2px
            for (let i = 0; i < Canvas.WIDTH + 1; i++) {
                ctx.fillRect(i * scale, 0, 2, canvas.height);
            }
            for (let i = 0; i < Canvas.HEIGHT + 1; i++) {
                ctx.fillRect(0, i * scale, canvas.width, 2);
            }
        }

        ctx.fillStyle = '#000';

        //draw pixels over grid
        for (let i = 0; i < this.props.pixels.length; i++) {
            for (let j = 0; j < this.props.pixels[i].length; j++) {
                if (this.props.pixels[i][j] === 1) {
                    ctx.fillRect(j * scale, i * scale, scale + 2, scale + 2);
                }
            }
        }
    }

    handleClick(e: MouseEvent) {
        if (!this.canvas.current) return;
        let rect = this.canvas.current.getBoundingClientRect();
        let scale = this.state.scale;

        let x = Math.floor((e.clientX - rect.left) * (this.canvas.current.width / rect.width) / scale);
        let y = Math.floor((e.clientY - rect.top) * (this.canvas.current.height / rect.height) / scale);

        this.setState({ lastX: x, lastY: y });

        if (this.state.painting && this.state.lastX === x && this.state.lastY === y) return;

        let value = e.ctrlKey ? 0 : 1;
        if (this.state.blend && !e.ctrlKey) {
            value = this.props.pixels[y][x] === 1 ? 0 : 1;
        }
        this.props?.onClick(x, y, value);
    }

    handleKeyUp(e: KeyboardEvent) {
        switch (e.code) {
            case 'KeyG':
                this.setState({ showGrid: !this.state.showGrid });
                break;
            case 'KeyB':
                this.setState({ blend: !this.state.blend });
                break;
            case 'Delete':
                this.props?.onClear();
                break;

        }
    }

    handleMouseDown() {
        this.setState({ painting: true });
    }

    handleMouseUp(e: MouseEvent) {
        this.setState({ painting: false }, () => this.handleClick(e));
    }

    handleMouseMove(e: MouseEvent) {
        if (!this.state.painting) return;
        this.handleClick(e);
    }

    render() {
        return (
            <>
                <canvas className='canvas' ref={this.canvas} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp} onMouseMove={this.handleMouseMove}></canvas>
                <small className='d-block w-100 text-end text-muted'>Press <Button variant='link' size='sm' className='m-0 p-0 border-0 align-baseline'>[ctrl]</Button> to erase, <Button variant='link' size='sm' className='m-0 p-0 border-0 align-baseline' onClick={this.props?.onClear}>[delete]</Button> to clear, <Button variant='link' size='sm' className='m-0 p-0 border-0 align-baseline' onClick={() => this.setState({ showGrid: !this.state.showGrid })}>[g]</Button> to toggle grid, <Button variant='link' size='sm' className='m-0 p-0 border-0 align-baseline' onClick={() => this.setState({ blend: !this.state.blend })}>[b]</Button> to toggle blend mode</small>
            </>
        );
    }
}

export default Canvas;