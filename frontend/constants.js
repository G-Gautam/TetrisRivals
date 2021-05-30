'use strict';

const COLS = 15;
const ROWS = 30;
const BLOCK_SIZE = 30;

const COLORS = [
    'cyan',
    'blue',
    'orange',
    'yellow',
    'green',
    'purple',
    'red'
];

const SHAPES = [
    [],
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [2, 0, 0],
        [2, 2, 2],
        [0, 0, 0]
    ],
    [
        [0, 0, 3],
        [3, 3, 3],
        [0, 0, 0]
    ],
    [
        [4, 4],
        [4, 4]
    ],
    [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0]
    ],
    [
        [0, 6, 0],
        [6, 6, 6],
        [0, 0, 0]
    ],
    [
        [7, 7, 0],
        [0, 7, 7],
        [0, 0, 0]
    ]
];


const KEY = {
    RL: 'Shift',
    LEFT: 'a',
    RIGHT: 'd',
    DOWN: 's',
    RR: 'f',
    SPACE: ' ',
}

const ROTATION = {
    LEFT: 'left',
    RIGHT: 'right'
};

[COLORS, SHAPES, KEY, ROTATION].forEach(item => Object.freeze(item));

const gameString = "<div id=game> <audio id=audio src='Assets/gameMusic.mp3'autoplay loop></audio> <div class='title-ctn'> <h1 class=title>T</h1>    <h1 class=title>E</h1>    <h1 class=title>T</h1>    <h1 class=title>R</h1><h1 class=title>I</h1>    <h1 class=title>S</h1></div><div class='play-area'>    <div class='grid'>        <div class='info' id='info-1'>            <p>Player 1</p>            <p>Score: 0</p>        </div>        <div class=canvas-ctn>            <canvas id='board-1' class='game-board'></canvas>            <canvas id=next-1 class=next></canvas>        </div>        <button class=ready id=ready1 onclick='ready()'>Ready</button>    </div>    <h3 id=code></h3>    <div class='grid'>        <div class='info' id='info-2'>            <p>Player 2</p>            <p>Score: 0</p>        </div>        <div class=canvas-ctn>            <canvas id=next-2 class=next></canvas>            <canvas id='board-2' class='game-board'></canvas>        </div>        <button class=ready id=ready2 disabled>Waiting</button>    </div></div><div class='title-ctn'>    <h1 class=title>R</h1>    <h1 class=title>I</h1>    <h1 class=title>V</h1>    <h1 class=title>A</h1>    <h1 class=title>L</h1>    <h1 class=title>S</h1></div></div>"