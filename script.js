import {createBoard, markTile, TILE_STATUSES, revealTile, checkWin, checkLose} from './minesweeper.js';

const BOARD_SIZE = 8;
const NUMBER_OF_MINES = 8;

const board = createBoard(BOARD_SIZE, NUMBER_OF_MINES);
const boardElement = document.querySelector('.board');
const minesLeftText = document.querySelector('[data-mine-count]');
const messageText = document.querySelector('.subtext');
const refresh = document.querySelector('.ref');

// refresh.style.setProperty('display', "none");
// console.log(board);

boardElement.style.setProperty("--size", BOARD_SIZE);

board.forEach(row => {
    row.forEach(tile => {
        boardElement.append(tile.element);
        tile.element.addEventListener('click',()=> {
            revealTile(board, tile);
            checkGameEnd();
        })
        tile.element.addEventListener('contextmenu', e => {
            e.preventDefault();
            markTile(tile);
            listMinesLeft();
        })
    })
})

minesLeftText.textContent = NUMBER_OF_MINES;

function listMinesLeft(){
    const markedTilesCount = board.reduce((count,row) => {
        return (
            count + row.filter(tile => tile.status === TILE_STATUSES.MARKED).length
        )
    },0)
    
    minesLeftText.textContent = NUMBER_OF_MINES - markedTilesCount
}

function checkGameEnd() {
    const win = checkWin(board);
    const lose = checkLose(board);

    if(win || lose){
        boardElement.addEventListener("click", stopProp, {capture:true})
        boardElement.addEventListener("contextmenu", stopProp, {capture:true})
        refresh.style.setProperty('display', "block");
        refresh.addEventListener("click", playAgain);
    }

    if(win){
        messageText.textContent = "You Win";
        refresh.textContent = "You Win Play Again"
    }
    if(lose){
        refresh.textContent = "You Lose Play Again"
        messageText.textContent = "You Lose";
        board.forEach(row => {
            row.forEach(tile => {
                if(tile.status===TILE_STATUSES.MARKED) markTile(tile)
                if(tile.mine) revealTile(board,tile)
            })
        })
    }
}

function stopProp(e){
    e.stopImmediatePropagation();
}

function playAgain(){
    location.reload();
}