class Board {
    reset = () => {
        this.grid = this.getEmptyBoard()
    }

    getEmptyBoard = () => {
        return Array.from({ length: ROWS }, () => Array(COLS).fill(0))
    }


    valid = (p) => {
        return p.shape.every((row, dy) => {
            return row.every((value, dx) => {
                let x = p.x + dx;
                let y = p.y + dy;
                return (
                    this.isEmpty(value) ||
                    (this.insideWalls(x) &&
                        this.aboveFloor(y)
                    ));
            });
        });
    }

    rotate = (piece, direction) => {
        let p = JSON.parase(JSON.stringify(piece));
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