import React, { useState,useEffect } from 'react'
import './Board.css';
import { randomIntFromInterval } from '../utils/random';

class LinkedListNode{
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}
class LinkedList{
    constructor(){
        this.head = null;
        this.size = 0;
    }
    //add a node to the linked list at the end
    add(elem){
    //create a new node 
    const newNode = new LinkedListNode(elem);
    //to store current node
    var curr;
    //if the list is empty
    if(this.head === null)
        this.head = newNode;
    else {
        curr = this.head;
        //iterate to the end of the list
        while(curr.next){
            curr = curr.next;
        }
        curr.next = newNode;
    }
    this.size++;
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

const BOARD_SIZE = 12;
const getStartingSnakeLLValue = board => {
    const rowSize = board.length;
    const colSize = board[0].length;
    const startingRow = Math.round(rowSize / 3);
    const startingCol = Math.round(colSize / 3);
    const startingCell = board[startingRow][startingCol];
    return {
      row: startingRow,
      col: startingCol,
      cell: startingCell,
    };
  };
  
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
    const [snake, setSnake] = useState(new SinglyLinkedList(getStartingSnakeLLValue(board)));
    const [foodCell, setFoodCell] = useState(snake.head.value.cell + 5);
    const [snakeCells, setSnakeCells] = useState(new Set([snake.head.value.cell]));
    const [direction, setDirection] = useState(Direction.RIGHT);

    useEffect(() => {
        window.addEventListener('keydown', e => {
          handleKeydown(e);
        });
      }, []);
    // window.addEventListener('keydown', e => {
    //     const newDirection = getDirectionfromFromKey(e.key);
    //     console.log(newDirection);
    //     const isValidDirection = newDirection !== '';
    //     if(isValidDirection){
    //         setDirection(newDirection);
    //     }
    // },[]);
    const handleKeydown = e => {
        const newDirection = getDirectionFromKey(e.key);
        console.log(newDirection);
        const isValidDirection = newDirection !== '';
        if (!isValidDirection) return;
        setDirection(newDirection);
    };
    function moveSnake(){
        const currentHeadCoords = {
            row: snake.head.value.row, 
            col: snake.head.value.col
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
            {
            row: nextHeadCoords.row,
            col: nextHeadCoords.col,
            cell: nextHeadValue
            }
        );
        console.log(new Cell(nextHeadCoords.row,nextHeadCoords.col,nextHeadValue));
        const currentHead = snake.head;
        snake.head = newHead;
        currentHead.next = newHead;
        const newSnakeCells = new Set(snakeCells);
        newSnakeCells.delete(snake.tail.value.cell);
        //console.log(snake.tail.value.cell);
        newSnakeCells.add(nextHeadValue);

        snake.tail = snake.tail.next;
        if(snake.tail === null) snake.tail = snake.head;

        setSnakeCells(newSnakeCells);
    }
    // const NextTailCoords = getNextTailCoords(currentTailCoords,CurrentTailDirection);
    // if(isOutOfBounds(nextTailCoords,board)){
    //     handleGameOver();
    //     return;
    // }
    const growSnake = () => {
        const currentTailCoords = {
            row: snake.tail.value.row,
            col: snake.tail.value.col,
        }
        const growthNodeCoords = getNextTailCoords(currentTailCoords,direction);
        if(isOutOfBounds(growthNodeCoords,board)){
            handleGameOver();
            return;
        }
    const newTailCell = board[growthNodeCoords.row][growthNodeCoords.col];
    const newTail = new LinkedListNode({
        row: growthNodeCoords.row,
        col: growthNodeCoords.col,
        Cell: newTailCell
    });
    const currentTail = snake.tail;
    snake.tail = newTail;
    snake.tail.next = currentTail;
    const newSnakeCells = new Set(snakeCells);
    console.log(newSnakeCells);
    newSnakeCells.add(newTailCell);

    setSnakeCells(newSnakeCells);
    };

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
    const getNextTailCoords = (currentTailCoords,direction) => {
        if(direction === Direction.UP)
            {
                return {
                    row: currentTailCoords.row + 1,
                    col: currentTailCoords.col
                };
            }
        if(direction === Direction.DOWN){
            return{
                row: currentTailCoords.row - 1,
                col: currentTailCoords.col
            };
        }
        if(direction === Direction.LEFT){
            return{
                row: currentTailCoords.row,
                col: currentTailCoords.col + 1
            };
        }
        if(direction === Direction.RIGHT){
            return{
                row: currentTailCoords.row,
                col: currentTailCoords.col - 1
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
    return (
        <>
        <button onClick={() => moveSnake()}>Move Manually</button>
        <button onClick={growSnake}>Grow manually</button>
        <p className="score-board">Your Score: {score}</p>
        <div className="board">
            {board.map((row,rowIdx) =>(
                <div key={rowIdx} className="row">{
                    row.map((cellValue,cellIdx) => (
                        <div key={cellIdx} className={`cell ${
                            snakeCells.has(cellValue) ? 'snake-cell' : ''
                        }${foodCell === cellValue ? 'food-cell' : ''}`}>{cellValue}</div>
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
    if(row >= board.length || col >= board[0].length)
    return true;
    return false;
};
const getDirectionFromKey = key => {
    if(key === 'ArrowUp') return Direction.UP;
    if(key === 'ArrowRight') return Direction.RIGHT;
    if(key === 'ArrowLeft') return Direction.LEFT;
    if(key === 'ArrowDown') return Direction.DOWN;
    return '';
}

export default Board;

