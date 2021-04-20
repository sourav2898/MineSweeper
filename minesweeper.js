export const TILE_STATUSES = {
    HIDDEN: "hidden",
    MINE: "mine",
    NUMBER:"number",
    MARKED:"marked",
}

export function createBoard (boardSize, numberOfMines) {
    const board = [];
    const minePositions = getMinePositions(boardSize, numberOfMines);
    // console.log(minePosition);

    for(let x = 0; x<boardSize; x++){
        const row = [];
        for(let y = 0; y<boardSize; y++){
            const element = document.createElement('div');
            element.dataset.status = TILE_STATUSES.HIDDEN;

            const tile = {
                element,
                x,
                y,
                mine: isMine(x,y,minePositions),
                get status(){
                    return this.element.dataset.status;
                },
                set status(value){
                    this.element.dataset.status = value;
                }
            }
            row.push(tile);
        }
        board.push(row);
    }
    return board;
}

export function markTile(tile){
    if(tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED) return;

    if(tile.status === TILE_STATUSES.MARKED) tile.status = TILE_STATUSES.HIDDEN;
    else tile.status = TILE_STATUSES.MARKED;
}

function getMinePositions(boardSize, numberOfMines){
    const positions = [];

    while(positions.length < numberOfMines){
        const position = {
            x: getRandom(boardSize),
            y: getRandom(boardSize)
        }

        if(!positions.some(positionMatch.bind(null, position))){
            positions.push(position);
        }
    }

    return positions;
}

export function checkWin(board){
    return board.every(row => {
        return row.every(tile => {
            return (tile.status === TILE_STATUSES.NUMBER || (
              tile.mine && (tile.status === TILE_STATUSES.HIDDEN || tile.status === TILE_STATUSES.MARKED) 
            ))
        })
    }) 
}

export function checkLose(board){
    return board.some(row => {
        return row.some(tile => {
            return tile.status === TILE_STATUSES.MINE;
        })
    })
}

export function revealTile(board, tile){
    if(tile.status !== TILE_STATUSES.HIDDEN) return

    if(tile.mine){
        tile.status = TILE_STATUSES.MINE
        return
    }
    tile.status = TILE_STATUSES.NUMBER
    const adjacentTiles = nearbyTiles(board,tile);
    const mine = adjacentTiles.filter(t => t.mine);

    if(mine.length===0){
        adjacentTiles.forEach(revealTile.bind(null,board))
    }else{
        tile.element.textContent = mine.length;
    }
}

function positionMatch(a,b){
    return a.x===b.x && a.y===b.y;
}

function getRandom(size){
    return Math.floor(Math.random()*size);
}

function isMine(x,y,minePositions){
    for(let i=0;i<minePositions.length;i++){
        if(minePositions[i].x === x && minePositions[i].y===y){
            return true;
        }
    }
    return false;
}

function nearbyTiles(board, tile){
    const tiles = [];

    for(let x = -1;x<=1;x++){
        for(let y = -1;y<=1;y++){
            const currentTile = board[x + tile.x]?.[y + tile.y];
            if(currentTile) tiles.push(currentTile);
        }
    }
    return tiles; 
}