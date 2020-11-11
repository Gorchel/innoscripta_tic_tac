import React from 'react';
import calculateWinner from './Winner.js';
import Square from "./Square";
var _ = require('lodash');

class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(9).fill(null),
            xIsNext: true,
            gameMap: [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
                [0, 3, 6],
                [1, 4, 7],
                [2, 5, 8],
                [0, 4, 8],
                [2, 4, 6],
            ],
            playerStepInCenter: Array(9).fill(null),
        };

        this.state.playerStepInCenter.splice(4, 1, 'X');
    }

    handleClick(i, squares, isX) {
        if (calculateWinner(squares, this.state.gameMap) || squares[i]) {
            return squares;
        }
        squares[i] = isX ? 'X' : 'O';

        return squares;
    }

    playerStep(i) {
        let squares = this.state.squares.slice();

        squares = this.handleClick(i, squares, true);
        squares = this.computerStep(squares, false);

        this.setState({
            squares: squares,
            xIsNext: true,
        });
    }

    computerStep(squares) {
        var i = this.findNextStep(squares);

        return this.handleClick(i, squares);
    }

    findNextStep(squares) {
        var optimalStep = 4,//First step to win
            cornerSteps = [0,2,6,8];//Second step to win


        if (_.isEmpty(squares[optimalStep])) {
            //First optimal step
            return optimalStep;
        }

        optimalStep = null;

        //Check player center step
        if (squares.length == this.state.playerStepInCenter.length && squares.every((v,i)=>v === this.state.playerStepInCenter[i])) {
            _.forEach(cornerSteps, function(value) {
                if (squares[value] == null) {
                    optimalStep = value;
                }
            });
        }

        if (optimalStep != null) {
            return optimalStep;
        }

        //Search lose step for player
        optimalStep = this.indexSelection(2, squares);

        if (optimalStep != null) {
            return optimalStep;
        }

        //search 1 selected step
        optimalStep = this.indexSelection(1, squares);
        // console.log(optimalStep);
        if (optimalStep != null) {
            return optimalStep;
        }

        //search free
        _.forEach(squares, function(value, key) {
            if (value == null) {
                optimalStep = key;
            }
        });

        return optimalStep;
    }

    indexSelection(strategyCount, squares) {
         var optimalStep = null;

        _.forEach(this.state.gameMap, function(line) {
            var count = 0,
                freeIndex = null;

            _.forEach(line, function(elIndex) {
                if (squares[elIndex] !== 'O') {
                    if (squares[elIndex] === 'X') {
                        count++;
                    } else {
                        freeIndex = elIndex;
                    }
                }
            });

            if (count >= strategyCount) {

                optimalStep = freeIndex;
                return false;
            }
        });

        return optimalStep;
    }

    renderSquare(i) {
        return (
            <Square
                value={this.state.squares[i]}
                onClick={() => this.playerStep(i)}
            />
        );
    }

    render() {
        const winner = calculateWinner(this.state.squares, this.state.gameMap);
        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div>
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

export default Board;