document.addEventListener('DOMContentLoaded', () => {
    startGameDummy = () => {
        location.href = 'game.html'
    }

    //Game.html

    const canvasList = document.getElementsByClassName('game-board');
    const ctxList = [];
    [...canvasList].forEach((canvas) => {
        const ctx = canvas.getContext('2d');
        // Calculate size of canvas from constants.
        ctx.canvas.width = COLS * BLOCK_SIZE;
        ctx.canvas.height = ROWS * BLOCK_SIZE;
        ctxList.push(ctx);
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
        // Scale blocks
        ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
    })

    const ctx = ctxList[0]
    let board = new Board();

    startGame = () => {
        board.reset();
        let piece = new Piece(ctx);
        piece.draw();
        board.piece = piece;
    }

    const moves = {
        [KEY.SHIFT]: p => ({...p, y: p.y + 1 }),
        [KEY.LEFT]: p => ({...p, x: p.x - 1 }),
        [KEY.RIGHT]: p => ({...p, x: p.x + 1 }),
        [KEY.DOWN]: p => ({...p, y: p.y + 1 })
    };

    document.addEventListener('keydown', event => {
        console.log(event.key)
        if (moves[event.key]) {
            // Stop the event from bubbling.
            event.preventDefault();
            // Get new state of piece
            let p = moves[event.key](board.piece);

            if (board.valid(p)) {
                // If the move is valid, move the piece.
                board.piece.move(p);

                // Clear old position before drawing.
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                board.piece.draw();
            }
        }
        if (event.key === KEY.SHIFT) {
            // Hard drop
            while (board.valid(p)) {
                board.piece.move(p);
                p = moves[KEY.DOWN](board.piece);
            }
        }
    });
})