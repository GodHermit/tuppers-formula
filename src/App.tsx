import { Component } from 'react';
import { Col, Container, Form, Row, Tab, Tabs } from 'react-bootstrap';
import Canvas from './components/Canvas';

import bigInt from 'big-integer';
import { ChangeEvent } from 'react';
import './App.scss';

class App extends Component<{}, any> {
    constructor(props: {}) {
        super(props);

        this.state = {
            k: '4858450636189713423582095962494202044581400587983244549483093085061934704708809928450644769865524364849997247024915119110411605739177407856919754326571855442057210445735883681829823754139634338225199452191651284348332905131193199953502413758765239264874613394906870130562295813219481113685339535565290850023875092856892694555974281546386510730049106723058933586052544096664351265349363643957125565695936815184334857605266940161251266951421550539554519153785457525756590740540157929001765967965480064427829131488548259914721248506352686630476300',
            pixels: []
        };

        this.handleKChange = this.handleKChange.bind(this);
        this.handleBinnaryChange = this.handleBinnaryChange.bind(this);
        this.handleCanvasClick = this.handleCanvasClick.bind(this);
        this.handleCanvasClear = this.handleCanvasClear.bind(this);
    }

    componentDidMount() {
        this.setState({ pixels: this.toGraph(this.state.k) });
    }

    toGraph(number: string, fromBinary: boolean = false): number[][] {
        if (!fromBinary && parseInt(number, 10) < 1) throw new Error('k must be greater than 0');

        let binary = fromBinary ? number : bigInt(number).divide(17).toString(2);
        let pixels: number[][] = Array.prototype.concat.apply([], Array(17)).map(() => {
            return Array.prototype.concat.apply([], Array(106)).map(n => 0)
        });

        if (binary.length < 1802) binary = '0'.repeat(1802 - binary.length) + binary

        for (let width = 0; width < 106; width++) {
            for (let height = 0; height < 17; height++) {
                pixels[height][width] = parseInt(binary[(105 - width) * 17 + height]);
            }
        }

        return pixels;
    }

    toNumber(pixels: number[][]): string {
        let binary = '';

        for (let j = 105; j >= 0; --j) {
            for (let i = 0; i < 17; ++i) {
                binary += String(pixels[i][j])
            }
        }

        return bigInt(binary, 2).multiply(17).toString();
    }

    handleKChange(e: ChangeEvent): void {
        this.setState({
            k: (e.target as HTMLTextAreaElement).value,
            pixels: this.toGraph((e.target as HTMLTextAreaElement).value)
        });
    }

    handleBinnaryChange(e: ChangeEvent): void {
        let newPixel = this.toGraph((e.target as HTMLTextAreaElement).value, true);

        this.setState({
            k: this.toNumber(newPixel),
            pixels: newPixel
        });
    }

    handleCanvasClick(x: number, y: number, value: 0 | 1 = 1): void {
        let newPixels = this.state.pixels.map((row: number[], i: number) => {
            if (i === y) {
                return row.map((pixel: number, j: number) => {
                    if (j === x) {
                        return value;
                    }
                    return pixel;
                });
            }
            return row;
        });
        this.setState({
            k: this.toNumber(newPixels),
            pixels: newPixels
        });
    }

    handleCanvasClear(): void {
        this.setState({
            k: '',
            pixels: this.state.pixels.map((row: number[], i: number) => {
                return row.map((pixel: number, j: number) => {
                    return 0;
                });
            })
        });
    }

    render() {
        return (
            <>
                <Container as='main' className='main'>
                    <div>
                        <Row>
                            <Col>
                                <h1 className='display-1'>Tupper's self-referential formula</h1>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <p className='lead'>Tupper's self-referential formula is a formula that visually represents itself when graphed at a specific location in the (x, y) plane.</p>
                                <p className='lead'>Read more on <a href='https://en.wikipedia.org/wiki/Tupper%27s_self-referential_formula' target='_blank' rel='noopener noreferrer'>Wikipedia</a>.</p>
                            </Col>
                        </Row>
                        <Row className='mb-3'>
                            <Col>
                                <Canvas pixels={this.state.pixels} onClick={this.handleCanvasClick} onClear={this.handleCanvasClear} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Tabs>
                                    <Tab eventKey='decimal' title='Decimal (k)'>
                                        <Form.Group controlId='decimal'>
                                            <Form.Control as='textarea' rows={5} value={this.state.k} onChange={(e) => this.handleKChange(e)} />
                                        </Form.Group>
                                    </Tab>
                                    <Tab eventKey='binary' title='Binary'>
                                        <Form.Group controlId='binary'>
                                            <Form.Control as='textarea' rows={5} value={bigInt(this.state.k).divide(17).toString(2)} onChange={(e) => this.handleBinnaryChange(e)} />
                                        </Form.Group>
                                    </Tab>
                                </Tabs>
                            </Col>
                        </Row>
                    </div>
                </Container>
                <Container as='footer' className='footer'>
                    <Row>
                        <Col>
                            <span>Made with 🖤 by <a href='https://godhermit.github.io/' target='_blank'>Oleh Proidakov</a>.</span>
                        </Col>
                    </Row>
                </Container>
            </>
        );
    }
}
export default App;
