import { emit, on } from "./bus";
import { canvas, renderAndFill, renderLines, retainTransform } from "./canvas";
import { LIGHT_BROWN, TAN } from "./color";
import { GAME_OVER, RESTART_GAME, RUNESTONE_MOVE, SCORED } from "./events";

function GameArena() {
    let score = 0;
    let gameOver = false;
    let showInstruction = true;
    let restartButton = null;

    function render(ctx) {
        retainTransform(() => {
            ctx.setTransform(1,0,0,1,0,0);
            ctx.fillStyle = LIGHT_BROWN;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });

        ctx.strokeStyle = '#fbcda1';
        ctx.lineWidth = 4;
        ctx.beginPath();
        const SIZE = 80;
        for (let x = 0; x <= 6; x++) {
            ctx.moveTo(x * SIZE, 0);
            ctx.lineTo(x * SIZE, 6 * SIZE);
            ctx.moveTo(0, x * SIZE);
            ctx.lineTo(6 * SIZE, x * SIZE);
        }
        ctx.stroke();

        // draw score
        if (showInstruction) {
            ctx.fillStyle = "#222";
            ctx.textAlign = "center";
            ctx.font = `bold 30px arial`;
            ctx.fillText(`绘制符号移动符文石`, SIZE * 2.5, -SIZE * 0.5);
        } else {
            if (!gameOver) {
                ctx.fillStyle = "#222";
                ctx.textAlign = "center";
                ctx.font = `bold 30px arial`;
                ctx.fillText(`${score} ${score == 1 ? '敌人' : '敌人'} 被消灭`, SIZE * 3, -SIZE * 0.5);
            } else {
                ctx.fillStyle = "#f00";
                ctx.textAlign = "center";
                ctx.font = `bold 30px arial`;
                ctx.fillText(`游戏结束！（分数 = ${score}）`, SIZE * 3, -SIZE * 0.5);
            }
        }

        // draw restart button (always visible, positioned next to the grid)
        const gridSize = 6 * 80; // 6x6 grid, 80 pixels per cell
        const buttonX = gridSize + 20; // Position right next to the grid
        const buttonY = 20; // Top of the grid area
        const buttonWidth = 100;
        const buttonHeight = 40;

        // button background
        ctx.fillStyle = "#0066cc";
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

        // button border
        ctx.strokeStyle = "#004499";
        ctx.lineWidth = 2;
        ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);

        // button text
        ctx.fillStyle = "#fff";
        ctx.textAlign = "center";
        ctx.font = `bold 16px arial`;
        ctx.fillText("重新开始", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2 + 5);

        // draw game rules text between grid and drawing area
        const gridBottom = 6 * 80; // 480
        const drawingTop = canvas.height * 0.65;
        const rulesY = gridBottom + 20; // Start just below the grid
        const rulesX = 20; // Left aligned for better mobile readability
        ctx.fillStyle = "#222";
        ctx.textAlign = "left";
        ctx.font = `14px arial`;
        const rules = [
            "操作说明",

            "在网格上绘制（鼠标或触摸）符号来控制符文石移动。",

            "使用屏幕左半部分上下移动。",

            "使用屏幕右半部分左右移动。",

            "穿过能量球落地时会释放法术。",

            "能量球的颜色决定法术类型。",

            "能量球的形状决定攻击模式。",

            "尽可能多地击败敌人。祝你好运！"
        ];
        rules.forEach((rule, index) => {
            ctx.fillText(rule, rulesX, rulesY + index * 18);
        });
    }

    function update(dT) {

    }

    function onScored() {
        score += 1;
    }
    
    function onMove() {
        showInstruction = false;
    }

    function onGG() {
        gameOver = true;
    }

    function onRestart() {
        score = 0;
        gameOver = false;
        showInstruction = true;
        emit(RESTART_GAME);
    }

    on(SCORED, onScored);
    on(RUNESTONE_MOVE, onMove);
    on(GAME_OVER, onGG);
    on(RESTART_GAME, onRestart);

    return {
        update,
        render,
        order: -20,
        tags: ['game'],
        getScore: () => score,
        getGameOver: () => gameOver,
    }
}

export default GameArena;