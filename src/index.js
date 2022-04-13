/*
    React App intially created by following the tutorial here: https://reactjs.org/tutorial/tutorial.html

    'npm start' in the project root directory to serve at localhost:3000 (default port for React Apps)
*/
import React from "react";
import { createRoot } from 'react-dom/client';
import './index.css';

/* Function Component - simpler way to write components that only contain a render method and don't have
    their own state. State is raised to the Board, making this a Controlled Component */
function Square(props) {
    return (
        <button 
            className="square" 
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}

/* Inherited React Component - this is the recommended syntax for more complex Components that need to have their own
    methods, states, etc... */
class Board extends React.Component {
    renderSquare(i) {
        /* Generate a Square element */
        return (
            <Square 
                value={this.props.squares[i]}
                key={i} 
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    renderBoard(n) {
        /* Generate a Board of n Dimensions */
        const dimension = n;
        let board = [];

        for (let i = 0; i < dimension; i++) {
            board.push(
            <div className="board-row" key={i}>
                {(() => {
                        for (let j = 0; j < dimension; j++) {
                            board.push(this.renderSquare((dimension * i) + j))
                        }
                    }
                )()}
            </div>);
        }
        return board;
    }

    render() {
        /* dimension comes from Game state */
        const board = this.renderBoard(this.props.dimension);

        return (
            <div>
                {board}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        /* JS sub-classes must call super() */
        super(props);
        /* this tracks state for the whole Game, various 'states' cascade down to child components via
            their 'props' when they're called in JSX - can only be updated with this.setState() */
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            dimension: 3,
        };
    }

    handleClick(i) {
        /* this handleClick() cascades all the way down to the Square component through 'props'*/
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X': 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X': 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        dimension={this.state.dimension}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>{moves}</div>
                </div>
            </div>
        );
    }
}

// =============================================================================

function calculateWinner(squares) {
    /* Check against known winning combinations - Would like to do this programmatically with n-dimensions */ 
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

// =============================================================================

/* New method for rendering in React 18+ */
const container =  document.getElementById('root');
const root = createRoot(container);
root.render(
    <Game />
)

/* Old method for rendering pre React 18, required different import as well -
    import ReactDOM from 'react-dom' */
// ReactDOM.render(
//     <Game />,
//     document.getElementById('root')
// );