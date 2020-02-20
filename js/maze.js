
class Maze {

    constructor(nRows, nCols, cellSize) {
        this.nRows = nRows;
        this.nCols = nCols;
        this.cellSize = cellSize;
        this.canvas = document.querySelector('#mazeCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 2;
        this.resizeCanvas();
        this.grid = [];
        for (let i = 0; i < this.nRows; ++i) {
            this.grid.push([]);
            for (let j = 0; j < this.nCols; ++j) {
                this.grid[i].push(new Cell(j, i, this.cellSize));
            }
        }
        this.current = this.getCell(0, 0);
        this.stack = [this.current];
    }

    resizeCanvas() {
        this.canvas.width = this.nCols * this.cellSize;
        this.canvas.height = this.nRows * this.cellSize;
    }

    inBounds(x, y) {
        return x >= 0 && x < this.nCols && y >= 0 && y < this.nRows;
    }

    getCell(x, y) {
        if (this.inBounds(x, y)) {
            return this.grid[y][x];
        } else {
            return null;
        }
    }

    getNeighbors(cell) {
        const neighbors = [];
        for (const [offX, offY] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
            const x = cell.x + offX;
            const y = cell.y + offY;
            if (this.inBounds(x, y)) {
                neighbors.push(this.getCell(x, y));
            }
        }
        return neighbors;
    }

    randomNeighbor(cell) {
        const unvisitedNeighbors = this.getNeighbors(cell).filter(c => !c.visited);
        if (unvisitedNeighbors.length === 0) {
            return null;
        } else {
            return unvisitedNeighbors[Math.floor(Math.random() * unvisitedNeighbors.length)];
        }
    }

    shuffle(arr) {
        let k = arr.length;

        while (k > 0) {
            const i = Math.floor(Math.random() * k--);
            [arr[k], arr[i]] = [arr[i], arr[k]];
        }

        return arr;
    }

    removeWalls(a, b) {
        const x = a.x - b.x;
        const y = a.y - b.y;
        if (x === 1) {
            a.walls.west = false;
            b.walls.east = false;
        } else if (x === -1) {
            a.walls.east = false;
            b.walls.west = false;
        }
        if (y === 1) {
            a.walls.north = false;
            b.walls.south = false;
        } else if (y === -1) {
            a.walls.south = false;
            b.walls.north = false;
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.nRows; ++i) {
            for (let j = 0; j < this.nCols; ++j) {
                this.grid[i][j].draw(this.ctx);
            }
        }
    }

    update() {
        this.current.visited = true;
        const nextCell = this.randomNeighbor(this.current);
        if (nextCell) {
            this.removeWalls(this.current, nextCell);
            this.current.state = CellState.EXPLORED;
            this.current = nextCell;
            this.current.state = CellState.CURRENT;
            this.stack.push(this.current);
        } else if (this.stack.length > 0) {
            this.current.state = CellState.EXPLORED;
            this.current = this.stack.pop();
            this.current.state = CellState.CURRENT;
        }
    }

}

(() => {
    let m = new Maze(25, 25, 25);
    m.draw();

    let lastTime = 0;
    let delay = 0;

    let paused = true;
    let animationLoop;

    const inSpeed = document.querySelector('#inputSpeed');
    inSpeed.addEventListener('input', () => {
        delay = 1000 - inSpeed.value;
    });

    const dispFPS = document.querySelector('#dispFPS');

    const btnPause = document.querySelector('#btnStart');
    const btnReset = document.querySelector('#btnReset');
    const inputRows = document.querySelector('#inputRows');
    const inputCols = document.querySelector('#inputCols');
    const inputSize = document.querySelector('#inputSize');
    const inputAnimate = document.querySelector('#inputAnimate');

    inputAnimate.addEventListener('change', () => {
        if (inputAnimate.checked) {
            btnPause.disabled = false;
        } else {
            btnPause.disabled = true;
            paused = true;
            btnPause.innerHTML = 'Start';
        }
    });

    btnPause.addEventListener('click', () => {
        if (paused && inputAnimate.checked) {
            paused = false;
            btnPause.innerHTML = 'Pause';
        } else {
            paused = true;
            btnPause.innerHTML = 'Start';
        }
    });

    btnReset.addEventListener('click', () => {
        cancelAnimationFrame(animationLoop);
        let nRows = parseInt(inputRows.value);
        let nCols = parseInt(inputCols.value);
        let cellSize = parseInt(inputSize.value);
        nRows = nRows < 1 ? 1 : nRows;
        nCols = nCols < 1 ? 1 : nCols;
        cellSize = cellSize < 1 ? 1 : cellSize;
        m = new Maze(nRows, nCols, cellSize);
        if (inputAnimate.checked) {
            paused = true;
            requestAnimationFrame(loop);
        } else {
            new Promise(resolve => {
                while (m.stack.length > 0) {
                    m.update();
                }
                m.current.state = CellState.EXPLORED;
                resolve();
            }).then(() => {
                m.draw();
            });
        }
    });

    function loop(t) {
        if (!paused) {
            if (m.stack.length > 0) {
                if (t - lastTime > delay) {
                    m.update();
                    m.draw();
                    dispFPS.innerHTML = `FPS: ${(1 / ((t - lastTime) / 1000)).toPrecision(4)}`
                    lastTime = t;
                }
            } else {
                m.current.state = CellState.EXPLORED;
                m.draw();
                return;
            }
        }
        
        requestAnimationFrame(loop);
    }
    animationLoop = requestAnimationFrame(loop);
})();

