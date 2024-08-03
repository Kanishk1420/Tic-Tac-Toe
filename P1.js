let boxes = document.querySelectorAll(".box");
let reset = document.querySelector("#reset");
let newgame = document.querySelector("#res");
let msgcontainer = document.querySelector(".msg");
let msg = document.querySelector("#win");
let turn0 = true;
const winpatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
];

boxes.forEach((box) => {
    box.addEventListener("click", () => {
        if (turn0) {
            box.innerText = "O";
            box.disabled = true;
            turn0 = false;
            checkwinner();
            if (!msgcontainer.classList.contains("show")) {
                setTimeout(computerMove, 500); // Delay of 0.5 seconds
            }
        }
    });
});

const computerMove = () => {
    let bestScore = -Infinity;
    let move;
    boxes.forEach((box, index) => {
        if (box.innerText === "") {
            box.innerText = "X";
            let score = minimax(boxes, 0, false, 3); // Limit depth to 3
            box.innerText = "";
            if (score > bestScore) {
                bestScore = score;
                move = index;
            }
        }
    });
    boxes[move].innerText = "X";
    boxes[move].style.color = "red";
    boxes[move].disabled = true;
    turn0 = true;
    checkwinner();
};

const scores = {
    X: 1,
    O: -1,
    draw: 0
};

const minimax = (newBoxes, depth, isMaximizing, maxDepth) => {
    let result = checkWinnerForMinimax();
    if (result !== null) {
        return scores[result];
    }
    if (depth >= maxDepth) {
        return 0; // Return a neutral score if max depth is reached
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        newBoxes.forEach((box, index) => {
            if (box.innerText === "") {
                box.innerText = "X";
                let score = minimax(newBoxes, depth + 1, false, maxDepth);
                box.innerText = "";
                bestScore = Math.max(score, bestScore);
            }
        });
        return bestScore;
    } else {
        let bestScore = Infinity;
        newBoxes.forEach((box, index) => {
            if (box.innerText === "") {
                box.innerText = "O";
                let score = minimax(newBoxes, depth + 1, true, maxDepth);
                box.innerText = "";
                bestScore = Math.min(score, bestScore);
            }
        });
        return bestScore;
    }
};

const checkWinnerForMinimax = () => {
    for (let pattern of winpatterns) {
        let pos1 = boxes[pattern[0]].innerText;
        let pos2 = boxes[pattern[1]].innerText;
        let pos3 = boxes[pattern[2]].innerText;
        if (pos1 !== "" && pos2 !== "" && pos3 !== "") {
            if (pos1 === pos2 && pos2 === pos3) {
                return pos1;
            }
        }
    }
    let openSpots = 0;
    boxes.forEach((box) => {
        if (box.innerText === "") {
            openSpots++;
        }
    });
    if (openSpots === 0) {
        return "draw";
    }
    return null;
};

const showwinner = (winner) => {
    msg.innerText = `Congratulations, Winner is ${winner}`;
    msgcontainer.classList.remove("hide");
    msgcontainer.classList.add("show");
};

const showdraw = () => {
    msg.innerText = "It's a Draw!";
    msg.style.display = "flex";
    msg.style.justifyContent = "center";
    msgcontainer.classList.remove("hide");
    msgcontainer.classList.add("show");
};


const checkwinner = () => {
    let filledBoxes = 0;
    let winnerFound = false;
    for (let pattern of winpatterns) {
        let pos1 = boxes[pattern[0]].innerText;
        let pos2 = boxes[pattern[1]].innerText;
        let pos3 = boxes[pattern[2]].innerText;
        if (pos1 !== "" && pos2 !== "" && pos3 !== "") {
            if (pos1 === pos2 && pos2 === pos3) {
                showwinner(pos1); // Pass the winner to the showwinner function
                disableAllBoxes();
                winnerFound = true;
                break;
            }
        }
    }
    if (!winnerFound) {
        boxes.forEach((box) => {
            if (box.innerText !== "") {
                filledBoxes++;
            }
        });
        if (filledBoxes === 9) {
            showdraw();
        }
    }
};

const disableAllBoxes = () => {
    boxes.forEach((box) => {
        box.disabled = true;
    });
};

reset.addEventListener("click", () => {
    boxes.forEach((box) => {
        box.innerText = "";
        box.disabled = false;
        box.style.color = "green";
    });
    msgcontainer.classList.remove("show");
    msgcontainer.classList.add("hide");
    turn0 = true;
});

newgame.addEventListener("click", () => {
    boxes.forEach((box) => {
        box.innerText = "";
        box.disabled = false;
        box.style.color = "green";
    });
    msgcontainer.classList.remove("show");
    msgcontainer.classList.add("hide");
    turn0 = true;
});
