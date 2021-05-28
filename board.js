class Board {
    constructor(ctx, ctxNext) {
        this.ctx = ctx;
        this.ctxNext = ctxNext;
        this.init();
    }

    addBackground = () => {
        for (let i = BLOCK_SIZE; i < ctx.canvas.width; i += BLOCK_SIZE) {
            ctx.moveTo(i, 0);
            ctx.lineTo(i, ctx.canvas.height);
            ctx.strokeStyle = "rgb(255,255,255,0.1)";
            ctx.lineWidth = 0.1;
            ctx.stroke();
        }
        for (let i = BLOCK_SIZE; i < ctx.canvas.height; i += BLOCK_SIZE) {
            ctx.moveTo(0, i);
            ctx.lineTo(ctx.canvas.width, i);
            ctx.strokeStyle = "rgba(255,255,255,0.1)";
            ctx.lineWidth = 0.1;
            ctx.stroke();
        }
    }

    init = () => {
        this.ctx.canvas.width = COLS * BLOCK_SIZE;
        this.ctx.canvas.height = ROWS * BLOCK_SIZE;
        this.addBackground();
        // Scale blocks
        ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
    }

    reset = () => {
        this.grid = this.getEmptyBoard();
        this.piece = new Piece(this.ctx);
        this.piece.setStartingPosition();
    }

    draw = () => {
        this.piece.draw();
        this.drawBoard();
    }

    drawBoard() {
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.fillStyle = COLORS[value];
                    this.ctx.fillRect(x, y, 1, 1);
                }
            });
        });
    }

    getEmptyBoard = () => {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0))
    }

    isInsideWalls(x, y) {
        return x >= 0 && x < COLS && y <= ROWS;
    }

    notOccupied(x, y) {
        return this.grid[y] && this.grid[y][x] === 0;
    }


    valid(p) {
        return p.shape.every((row, dy) => {
            return row.every((value, dx) => {
                let x = p.x + dx;
                let y = p.y + dy;
                return value === 0 || (this.isInsideWalls(x, y) && this.notOccupied(x, y));
            });
        });
    }

    rotate = (piece, direction) => {
        let p = JSON.parse(JSON.stringify(piece));
        if (!piece.hardDropped) {
            for (let y = 0; y < p.shape.length; ++y) {
                for (let x = 0; x < y; ++x) {
                    [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
                }
            }
            if (direction === ROTATION.RIGHT) {
                p.shape.forEach((row) => row.reverse());
            } else if (direction === ROTATION.LEFT) {
                p.shape.reverse();
            }
        }
        return p;
    }
}