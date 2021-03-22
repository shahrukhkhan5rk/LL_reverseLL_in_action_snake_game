import React, { useState } from 'react'
import './Board.css';
import { randomIntFromInterval } from '../utils/random';

class LinkedListNode{
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}
class SinglyLinkedList{
    constructor(value){
        const node = new LinkedListNode(value);
        this.head = node;
        this.tail = node;
    }
}
class Cell{
    constructor(row,col,value){
        this.row = row;
        this.col = col;
        this.value = value;
    }
}

const BOARD_SIZE = 10;
const Direction = {
    UP : 'UP',
    DOWN: 'DOWN',
    LEFT: 'LEFT',
    RIGHT: 'RIGHT'
}
const STARTING_SNAKE_CELL = 44;
const STARTING_FOOD_CELL = 48;
const STARTING_SNAKE_LL_VALUE = {
    row: 4,
    col: 3,
    Cell: STARTING_SNAKE_CELL
}

const Board  = () => {
    const [score, setScore] = useState(0);
    const [board, setBoard] = useState(createBoard(BOARD_SIZE));
    const [foodCell, setFoodCell] = useState(STARTING_FOOD_CELL);
    const [snakeCells, setSnakeCells] = useState(new Set([STARTING_SNAKE_CELL]));
    const [snake, setSnake] = useState(new SinglyLinkedList(STARTING_SNAKE_LL_VALUE));
    const [direction, setDirection] = useState(Direction.RIGHT);

    window.addEventListener('keydown', e => {
        const newDirection = getDirectionfromFromKey(e.key);
        console.log(newDirection);
        const isValidDirection = newDirection !== '';
        if(isValidDirection){
            setDirection(newDirection);
        }
    },[]);
    function moveSnake(){
        const currentHeadCoords = {
            row: snake.head.value.row, 
            col: snake.head.value.col,
        };
        const nextHeadCoords = getNextHeadCoords(currentHeadCoords,direction);
        if(isOutOfBounds(nextHeadCoords,board)){
            handleGameOver();
            return;
        }
        const nextHeadValue = board[nextHeadCoords.row][nextHeadCoords.col];
        if(snakeCells.nextHeadCell){
            handleGameOver();
            return;
        }

        if(nextHeadValue === foodCell) handleFoodConsumption();

        const newHead = new LinkedListNode(
            new Cell(nextHeadCoords.row,nextHeadCoords.col,nextHeadValue)
        );
        const newSnakeCells = new Set(snakeCells);
        newSnakeCells.delete(snake.tail.value.value);
        newSnakeCells.add(nextHeadValue);

        snake.head = newHead;
        snake.tail = snake.tail.next;
        if(snake.tail === null) snake.tail = snake.head;

        setSnakeCells(newSnakeCells);
    }
    const growSnake = () => {
        const growthNodeCoords = getGrowthNodeCoords(snake.tail,direction);
        if(isOutOfBounds(growthNodeCoords,board));
        //snake is positioned that i can't grow further 
        //so don't do anything
        return;
    }
    // const newTailCell = board[growthNodeCoords.row][growthNodeCoords.col];
    // const newTail = new LinkedListNode({
    //     row: growthNodeCoords.row,
    //     col: growthNodeCoords.col,
    //     Cell: newTailCell
    // });
    // const currentTail = snake.tail;
    // snake.tail = newTail;
    // snake.tail.next = currentTail;
    // const newSnakeCells = new Set(snakeCells);
    // newSnakeCells.add(newTailCell);
    // setSnakeCells(newSnakeCells);

    const getNextHeadCoords = (currentHeadCoords,direction) => {
        if(direction === Direction.UP)
            {
                return {
                    row: currentHeadCoords.row - 1,
                    col: currentHeadCoords.col
                };
            }
        if(direction === Direction.DOWN){
            return{
                row: currentHeadCoords.row + 1,
                col: currentHeadCoords.col
            };
        }
        if(direction === Direction.LEFT){
            return{
                row: currentHeadCoords.row,
                col: currentHeadCoords.col - 1
            };
        }
        if(direction === Direction.RIGHT){
            return{
                row: currentHeadCoords.row,
                col: currentHeadCoords.col + 1
            };
        }
    }
    const handleFoodConsumption = () => {
        setScore(score + 10);
        const maxPossibleCellValue = BOARD_SIZE * BOARD_SIZE;
        let nextFoodCell;
        while(true){
            nextFoodCell = randomIntFromInterval(1,maxPossibleCellValue);
            if(snakeCells.has(nextFoodCell) || foodCell === nextFoodCell) continue;
            break;
        }
        setFoodCell(nextFoodCell);
    }
    const handleGameOver = () => {
        console.log('Game Over!!!');
    }
    const handleGrowth = () => {
        console.log('handle growth');
    }
    
    return (
        <>
        <button onClick={() => moveSnake()}>Move Manually</button>
        <button onClick={handleGrowth}>Grow manually</button>
        <p className="score-board">Your Score: {score}</p>
        <div className="board">
            {board.map((row,rowIdx) =>(
                <div key={rowIdx} className="row">{
                    row.map((cellValue,cellIdx) => (
                        <div key={cellIdx} className={`cell ${
                            snakeCells.has(cellValue) ? 'snake-cell' : ''
                        }${foodCell === cellValue ? 'food-cell' : ''}`}></div>
                    ))
                }
                </div>
            ))}
        </div>
        </>
    )
};
const createBoard = BOARD_SIZE => {
    let counter = 1;
    const board = [];
    for(let row = 0;row < BOARD_SIZE; row++){
        const currentRow = [];
        for(let col = 0;col < BOARD_SIZE;col++){
            currentRow.push(counter++)
        }
        board.push(currentRow);
    }
    return board;
}
const isOutOfBounds = (coords, board) => {
    const {row, col} = coords;
    if(row < 0 || col < 0)return true;
    if(row >= board.length || col >= board[0].length)return true;
    return false;
};
const growthNodeCoords = () => {
    console.log("Grow slow");
};
const getGrowthNodeCoords = () => {
    console.log("get");
}
const getDirectionfromFromKey = key => {
    if(key === 'ArrowUp') return Direction.UP;
    if(key === 'ArrowRight') return Direction.RIGHT;
    if(key === 'ArrowLeft') return Direction.LEFT;
    if(key === 'ArrowDown') return Direction.DOWN;
    return '';
}

export default Board;

