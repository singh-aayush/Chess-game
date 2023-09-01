document.addEventListener('DOMContentLoaded', () => {
    let board = null;
    const game = new Chess();
    const movehistory = document.getElementById('move-history');
    let moveCount = 1;
    let userColor = 'w';

    const makeRandomMove = () => {
        const possibleMoves = game.moves();
        if (game.game_over()) {
            alert("Checkmate!");

        } else {
            const randomIdx = Math.floor(Math.random() * possibleMoves.length);
            const move = possibleMoves[randomIdx];
            game.move(move);
            board.position(game.fen());
            recordMove(move, moveCount);
            moveCount++;
        }
    };

    const recordMove = (move, count) => {
        const formattedMove = count % 2 === 1 ? `${Math.ceil(count / 2)}. ${move}` : `${move} -`;
        movehistory.textContent += formattedMove + ' ';
        movehistory.scrollTop = movehistory.scrollHeight;
    };

    const onDragStart = (source, piece) => {
        return !game.game_over() && piece.search(userColor) === 0;
    };

    const onDrop = (source, target) => {
        const move = game.move({
            from: source,
            to: target,
            promotion: 'q',
        });

        if (move === null) return 'snapback';


        window.setTimeout(makeRandomMove, 250);
        recordMove(move.san, moveCount);
        moveCount++;
    };


    const onSnapEnd = () => {
        board.position(game.fen());
    };


    const boardConfig = {
        showNotation: true,
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed: 'slow',
        snapBackSpeed: 500,
        snapSpeed: 100,
    };


    board = Chessboard('board', boardConfig);


    document.querySelector('.play-again').addEventListener('click', () => {
        game.reset();
        board.start();
        movehistory.textContent = '';
        moveCount = 1;
        userColor = 'w';
    });

    document.querySelector('.set-position').addEventListener('click', () => {
        const fen = prompt("Enter the FEN motation for the desired position");
        if (fen !== null) {
            if (game.load(fen)) {
                board.position(fen);
                movehistory.textContent = '';
                moveCount = 1;
                userColor = 'w';
            } else {
                alert("Invalid FEN motation. Please try again.");
            }
        }
    });

    document.querySelector(".flip-board").addEventListener('click', () => {
        board.flip();
        makeRandomMove();
        userColor = userColor === 'w' ? 'b' : 'w';
    });



});