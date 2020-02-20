
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
        this.stack = [this.current];
        for (let i = 0; i < this.nRows; ++i) {
            this.grid.push([]);
            for (let j = 0; j < this.nCols; ++j) {
                this.grid[i].push(new Cell(j, i, this.cellSize));
            }
        }
        this.current = this.getCell(0, 0);
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
        } else {
            this.current.state = CellState.EXPLORED;
            this.current = this.stack.pop();
            this.current.state = CellState.CURRENT;
        }
    }

}

(() => {
    let m = new Maze(100, 100, 10);

    let lastTime = 0;

    function loop(t) {
        if (m.stack.length > 0) {
            m.update();
            m.draw();
            m.ctx.fillStyle = 'white';
            m.ctx.font = '12px arial'
            m.ctx.fillText(20, 20, (t - lastTime) / 1000)
        }
        lastTime = t;
        requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
})();

