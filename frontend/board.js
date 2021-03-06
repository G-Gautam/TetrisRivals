class Board {
    constructor(ctx, ctxNext) {
        this.ctx = ctx;
        this.ctxNext = ctxNext;
        this.grid = this.getEmptyBoard();
        this.init();
    }

    addBackground = () => {
        for (let i = BLOCK_SIZE; i < this.ctx.canvas.width; i += BLOCK_SIZE) {
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, this.ctx.canvas.height);
            this.ctx.strokeStyle = "rgb(255,255,255,0.1)";
            this.ctx.lineWidth = 0.1;
            this.ctx.stroke();
        }
        for (let i = BLOCK_SIZE; i < this.ctx.canvas.height; i += BLOCK_SIZE) {
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(this.ctx.canvas.width, i);
            this.ctx.strokeStyle = "rgba(255,255,255,0.1)";
            this.ctx.lineWidth = 0.1;
            this.ctx.stroke();
        }
    }

    init = () => {
        this.ctx.canvas.width = COLS * BLOCK_SIZE;
        this.ctx.canvas.height = ROWS * BLOCK_SIZE;
        this.addBackground();
        // Scale blocks
        this.ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
    }

    reset = () => {
        this.grid = this.getEmptyBoard();
        this.piece = new Piece(this.ctx);
        this.piece.setStartingPosition();
        this.getNewPiece();
    }

    getNewPiece = () => {
        const { width, height } = this.ctxNext.canvas;
        this.next = new Piece(this.ctxNext);
        this.ctxNext.clearRect(0, 0, width, height);
        this.next.draw();
    }

    freeze = () => {
        let freeze = false
        this.piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.grid[y + this.piece.y][x + this.piece.x] = value;
                    freeze = true
                }
            });
        });
        return freeze;
    }

    drop = () => {
        let p = moves[KEY.DOWN](this.piece);
        if (this.valid(p)) {
            this.piece.move(p);
        } else {
            let freeze = this.freeze();
            let lines = this.clearLines();
            if (this.piece.y === 0) {
                // Game over
                return false;
            }
            this.piece = this.next;
            this.piece.ctx = this.ctx;
            this.piece.setStartingPosition();
            this.getNewPiece();
        }
        return true;
    }

    draw = () => {
        if (this.piece) {
            this.piece.draw();
        }
        this.drawBoard();
    }

    drawBoard = () => {
        if (this.grid) {
            this.grid.forEach((row, y) => {
                row.forEach((value, x) => {
                    if (value > 0) {
                        this.ctx.fillStyle = COLORS[value == 1 ? 6 : value - 1];
                        this.ctx.fillRect(x, y, 1, 1);
                    }
                });
            });
        }
    }

    clearLines = () => {
        let lines = 0;

        this.grid.forEach((row, y) => {
            // If every value is greater than zero then we have a full row.
            if (row.every((value) => value > 0)) {
                lines++;

                // Remove the row.
                this.grid.splice(y, 1);

                // Add zero filled row at the top.
                this.grid.unshift(Array(COLS).fill(0));
            }
        });
        if (lines > 0) return true;
        return false;

        // if (lines > 0) {
        //   // Calculate points from cleared lines and level.

        //   account.score += this.getLinesClearedPoints(lines);
        //   account.lines += lines;

        //   // If we have reached the lines for next level
        //   if (account.lines >= LINES_PER_LEVEL) {
        //     // Goto next level
        //     account.level++;

        //     // Remove lines so we start working for the next level
        //     account.lines -= LINES_PER_LEVEL;

        //     // Increase speed of game
        //     time.level = LEVEL[account.level];
        //   }
        // }
    }

    getEmptyBoard = () => {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0))
    }

    isInsideWalls = (x, y) => {
        return x >= 0 && x < COLS && y <= ROWS;
    }

    notOccupied = (x, y) => {
        return this.grid[y] && this.grid[y][x] === 0;
    }

    setGrid = (grid) => {
        this.grid = grid;
    }

    getGrid = () => {
        return this.grid;
    }

    setPiece = (piece) => {
        this.piece = piece;
    }

    getPiece = () => {
        return this.piece;
    }

    setNextPiece = (next) => {
        this.next = next
    }

    getNextPiece = () => {
        return this.next;
    }

    valid = (p) => {
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