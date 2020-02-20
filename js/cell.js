

const CellState = {
    UNEXPLORED: 0,
    EXPLORED: 1,
    WALL: 2,
    CURRENT: 3
}

class Cell {

    constructor(x, y, size) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.visited = false;
        this.state = CellState.UNEXPLORED;
        this.walls = {
            north: true,
            south: true,
            west: true,
            east: true
        }
    }

    draw(ctx) {
        let color;
        switch (this.state) {
            case CellState.UNEXPLORED:
                color = 'black';
                break;

            case CellState.EXPLORED:
                color = 'cyan';
                break;

            case CellState.CURRENT:
                color = 'green';
                break;

            default:
                color = 'white';
                break;
        }

        ctx.fillStyle = color;
        ctx.fillRect(this.x * this.size, this.y * this.size, this.size, this.size);

        if (this.visited) {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 2;
            ctx.beginPath();
            if (this.walls.north) {
                ctx.moveTo(this.x * this.size, this.y * this.size);
                ctx.lineTo(this.x * this.size + this.size, this.y * this.size);
            }
            if (this.walls.east) {
                ctx.moveTo(this.x * this.size + this.size, this.y * this.size);
                ctx.lineTo(this.x * this.size + this.size, this.y * this.size + this.size);
            }
            if (this.walls.south) {
                ctx.moveTo(this.x * this.size, this.y * this.size + this.size);
                ctx.lineTo(this.x * this.size + this.size, this.y * this.size + this.size);
            }
            if (this.walls.west) {
                ctx.moveTo(this.x * this.size, this.y * this.size);
                ctx.lineTo(this.x * this.size, this.y * this.size + this.size);
            }
            ctx.closePath();
            ctx.stroke();
        }

    }


}