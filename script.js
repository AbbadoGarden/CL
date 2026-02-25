const roleInfo = {
  pilot: "试飞员",
  scientist: "理论科学家",
  engineer: "空间工程师",
};

const scenes = [
  {
    title: "第一站：失重电梯思想实验",
    text: "你在深空中进入一座封闭电梯。若电梯上升，你会感到脚下有力；若静止在行星表面，你也感到同样压力。你如何解释？",
    options: [
      {
        text: "提出“等效原理”：加速度与重力局部不可区分。",
        score: 2,
        result: "精彩！你抓住了广义相对论起点：等效原理。",
      },
      {
        text: "认为只是设备误差，忽略这种感觉。",
        score: 0,
        result: "你错过了关键线索：重力与加速度可能是一回事。",
      },
    ],
  },
  {
    title: "第二站：光线会弯曲吗？",
    text: "你让一道激光穿过加速飞船舱体，光斑轨迹似乎下弯。若加速与重力等效，重力是否会让光线弯曲？",
    options: [
      {
        text: "会，时空几何影响光路，光沿弯曲时空传播。",
        score: 2,
        result: "正确！这就是后来“引力透镜”的核心思想。",
      },
      {
        text: "不会，光速恒定意味着路径必然绝对直线。",
        score: 0,
        result: "光速恒定不代表在所有坐标系里看起来都不弯。",
      },
    ],
  },
  {
    title: "第三站：行星轨道偏移",
    text: "你观测到类水星行星近日点缓慢进动，牛顿理论有微小误差。你给出怎样的解释？",
    options: [
      {
        text: "引力不是“力”拉扯，而是质量让时空弯曲。",
        score: 2,
        result: "很棒！你走到了爱因斯坦场方程的门口。",
      },
      {
        text: "再加一颗看不见的小行星来补偿数据。",
        score: 1,
        result: "这是历史上尝试过的思路，但不如几何解释深刻。",
      },
    ],
  },
];

const roleSelect = document.getElementById("roleSelect");
const playerName = document.getElementById("playerName");
const startBtn = document.getElementById("startBtn");
const setup = document.getElementById("setup");
const game = document.getElementById("game");
const hudName = document.getElementById("hudName");
const hudRole = document.getElementById("hudRole");
const scoreEl = document.getElementById("score");
const sceneTitle = document.getElementById("sceneTitle");
const sceneText = document.getElementById("sceneText");
const options = document.getElementById("options");
const restartBtn = document.getElementById("restartBtn");

let state = {
  name: "",
  role: "pilot",
  score: 0,
  sceneIndex: 0,
};

function renderScene() {
  const scene = scenes[state.sceneIndex];
  sceneTitle.textContent = scene.title;
  sceneText.textContent = scene.text;
  scoreEl.textContent = String(state.score);
  options.innerHTML = "";

  scene.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = option.text;
    btn.addEventListener("click", () => chooseOption(option));
    options.appendChild(btn);
  });
}

function chooseOption(option) {
  state.score += option.score;
  scoreEl.textContent = String(state.score);
  options.innerHTML = "";

  const result = document.createElement("div");
  result.className = "result";
  result.textContent = option.result;
  options.appendChild(result);

  const nextBtn = document.createElement("button");
  nextBtn.textContent = state.sceneIndex < scenes.length - 1 ? "前往下一站" : "查看结局";
  nextBtn.addEventListener("click", nextScene);
  options.appendChild(nextBtn);
}

function nextScene() {
  state.sceneIndex += 1;
  if (state.sceneIndex >= scenes.length) {
    showEnding();
    return;
  }
  renderScene();
}

function showEnding() {
  const maxScore = scenes.length * 2;
  const ratio = state.score / maxScore;
  let ending = "你完成了旅程，正在继续学习时空几何。";

  if (ratio >= 0.85) {
    ending = "你几乎复现了爱因斯坦的关键思路！你成为“时空领航员”。";
  } else if (ratio >= 0.5) {
    ending = "你已经抓住核心：等效原理与时空弯曲。继续前进！";
  }

  sceneTitle.textContent = "终章：你的相对论领悟";
  sceneText.textContent = `${state.name}（${roleInfo[state.role]}）最终领悟值：${state.score}/${maxScore}。${ending}`;
  options.innerHTML = "";
  restartBtn.classList.remove("hidden");
}

function startGame() {
  state.name = playerName.value.trim() || "无名旅者";
  state.role = roleSelect.value;
  state.score = 0;
  state.sceneIndex = 0;

  hudName.textContent = state.name;
  hudRole.textContent = roleInfo[state.role];
  scoreEl.textContent = "0";

  setup.classList.add("hidden");
  game.classList.remove("hidden");
  restartBtn.classList.add("hidden");
  renderScene();
}

function restartGame() {
  game.classList.add("hidden");
  setup.classList.remove("hidden");
}

startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
