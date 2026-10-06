// 定義測驗題目資料庫（共五題）
let quizData = [
  {
    question: "1. 在 p5.js 中，設定畫布大小的函式是哪一個？",
    options: ["A. size()", "B. createCanvas()", "C. setWindow()", "D. makeCanvas()"],
    correct: 1 // 選項 B (索引從 0 開始)
  },
  {
    question: "2. 哪一個函式可以在畫布上繪製一個圓形？",
    options: ["A. circle()", "B. drawRound()", "C. oval()", "D. sphere2D()"],
    correct: 0 // 選項 A
  },
  {
    question: "3. 若要改變圖形的填滿顏色，應該使用哪一個指令？",
    options: ["A. color()", "B. stroke()", "C. fill()", "D. background()"],
    correct: 2 // 選項 C
  },
  {
    question: "4. p5.js 中，每秒會重複執行的主要繪圖函式是？",
    options: ["A. setup()", "B. preload()", "C. loop()", "D. draw()"],
    correct: 3 // 選項 D
  },
  {
    question: "5. 哪一個變數可以用來取得當前滑鼠的 X 軸座標？",
    options: ["A. mouseX", "B. cursorX", "C. posX", "D. getMouseX()"],
    correct: 0 // 選項 A
  }
];

// 當前進行到第幾題（從 0 開始）
let currentQuestion = 0;
// 紀錄玩家選擇的選項索引（-1 表示尚未選擇）
let selectedOption = -1;
// 紀錄答對的總題數
let score = 0;
// 判斷當前題目是否已解答過
let answered = false;

// 選項按鈕的佈局參數
let optionX;        // 選項左上角 X 座標
let optionWidth;    // 選項寬度
let optionHeight = 50; // 選項高度
let optionSpacing = 15; // 選項之間的間距

// 初始設定函式（只執行一次）
function setup() {
  // 建立全螢幕畫布
  createCanvas(windowWidth, windowHeight);
  // 設定文字水平與垂直皆居中對齊
  textAlign(CENTER, CENTER);
  // 計算選項區域的寬度與起始 X 座標（水平置中，寬度為螢幕的 60%）
  optionWidth = width * 0.6;
  optionX = (width - optionWidth) / 2;
}

// 主繪圖循環函式（持續重複執行）
function draw() {
  // 設定背景顏色為淺灰色
  background(240);

  // 判斷是否所有題目都已作答完畢
  if (currentQuestion >= quizData.length) {
    // 顯示結算畫面
    drawResultScreen();
  } else {
    // 顯示測驗畫面
    drawQuizScreen();
  }
}

// 繪製測驗畫面的函式
function drawQuizScreen() {
  // 取得當前題目的資料
  let q = quizData[currentQuestion];

  // 繪製頂部進度提示文字
  textSize(20);
  fill(100);
  text(`第 ${currentQuestion + 1} 題 / 共 ${quizData.length} 題`, width / 2, 50);

  // 繪製題目文字
  textSize(24);
  fill(30);
  text(q.question, width / 2, 110);

  // 設定選項起始 Y 座標
  let startY = 180;

  // 迴圈繪製四個選項按鈕
  for (let i = 0; i < q.options.length; i++) {
    // 計算當前選項按鈕的基底 Y 座標
    let y = startY + i * (optionHeight + optionSpacing);
    // 預設跳動偏移量為 0
    let offsetY = 0;

    // 預設選項按鈕的背景顏色為白色
    let bgColor = color(255);

    // 如果已經作答
    if (answered) {
      // 判斷當前選項是否為正確答案
      if (i === q.correct) {
        // 若答錯，正確答案需加上 #caf0f8 背景色並上下跳動
        if (selectedOption !== q.correct) {
          bgColor = color("#caf0f8"); // 設定背景色為 caf0f8
          offsetY = sin(frameCount * 0.15) * 8; // 使用正弦函數計算上下跳動位移
        } else {
          // 若答對，正確答案顯示綠色背景
          bgColor = color(200, 250, 200);
        }
      } else if (i === selectedOption) {
        // 若當前選項是玩家選錯的選項，顯示紅色背景
        bgColor = color(250, 200, 200);
      }
    } else {
      // 未作答時，懸停在選項上顯示淺灰色提示
      if (isMouseOver(optionX, y, optionWidth, optionHeight)) {
        bgColor = color(230);
      }
    }

    // 繪製選項按鈕背景矩形（包含圓角與偏移量）
    fill(bgColor);
    stroke(180);
    strokeWeight(1);
    rect(optionX, y + offsetY, optionWidth, optionHeight, 10);

    // 繪製選項文字
    fill(30);
    noStroke();
    textSize(18);
    text(q.options[i], width / 2, y + offsetY + optionHeight / 2);
  }

  // 作答後顯示「下一題」或「查看結果」按鈕
  if (answered) {
    let btnY = startY + 4 * (optionHeight + optionSpacing) + 20;
    let btnWidth = 160;
    let btnHeight = 45;
    let btnX = (width - btnWidth) / 2;

    // 檢查滑鼠是否懸停在下一題按鈕上
    if (isMouseOver(btnX, btnY, btnWidth, btnHeight)) {
      fill(70, 130, 180); // 懸停深藍色
    } else {
      fill(100, 149, 237); // 預設藍色
    }

    // 繪製按鈕矩形
    rect(btnX, btnY, btnWidth, btnHeight, 8);

    // 繪製按鈕文字
    fill(255);
    textSize(18);
    let btnText = (currentQuestion === quizData.length - 1) ? "查看結果" : "下一題";
    text(btnText, width / 2, btnY + btnHeight / 2);
  }
}

// 繪製最終結算畫面的函式
function drawResultScreen() {
  // 顯示測驗完成標題
  textSize(36);
  fill(30);
  text("測驗完成！", width / 2, height / 2 - 60);

  // 顯示答對題數得分結果
  textSize(28);
  fill(50);
  text(`您的得分：答對 ${score} / ${quizData.length} 題`, width / 2, height / 2);

  // 繪製重新開始按鈕
  let btnW = 160;
  let btnH = 50;
  let btnX = (width - btnW) / 2;
  let btnY = height / 2 + 60;

  if (isMouseOver(btnX, btnY, btnW, btnH)) {
    fill(40, 167, 69); // 懸停深綠色
  } else {
    fill(76, 175, 80); // 預設綠色
  }

  rect(btnX, btnY, btnW, btnH, 8);

  fill(255);
  textSize(18);
  text("再測驗一次", width / 2, btnY + btnH / 2);
}

// 滑鼠點擊事件處理函式
function mousePressed() {
  // 測驗進行中且尚未作答時
  if (currentQuestion < quizData.length && !answered) {
    let startY = 180;
    // 檢查點擊了哪一個選項按鈕
    for (let i = 0; i < 4; i++) {
      let y = startY + i * (optionHeight + optionSpacing);
      if (isMouseOver(optionX, y, optionWidth, optionHeight)) {
        selectedOption = i; // 紀錄選擇的選項
        answered = true;    // 標記為已作答

        // 判斷是否答對，答對則累加得分
        if (i === quizData[currentQuestion].correct) {
          score++;
        }
        break;
      }
    }
  } 
  // 已經作答，點擊「下一題」按鈕
  else if (currentQuestion < quizData.length && answered) {
    let btnY = 180 + 4 * (optionHeight + optionSpacing) + 20;
    let btnWidth = 160;
    let btnHeight = 45;
    let btnX = (width - btnWidth) / 2;

    if (isMouseOver(btnX, btnY, btnWidth, btnHeight)) {
      currentQuestion++;  // 切換至下一題
      answered = false;   // 重置作答狀態
      selectedOption = -1; // 重置選擇的選項
    }
  } 
  // 所有題目結束，點擊「再測驗一次」按鈕
  else if (currentQuestion >= quizData.length) {
    let btnW = 160;
    let btnH = 50;
    let btnX = (width - btnW) / 2;
    let btnY = height / 2 + 60;

    if (isMouseOver(btnX, btnY, btnW, btnH)) {
      currentQuestion = 0; // 重置題目索引
      score = 0;           // 重置得分
      answered = false;    // 重置作答狀態
      selectedOption = -1;  // 重置選擇選項
    }
  }
}

// 輔助函式：判斷滑鼠座標是否落在指定的矩形區域內
function isMouseOver(x, y, w, h) {
  return mouseX >= x && mouseX <= x + w && mouseY >= y && mouseY <= y + h;
}

// 當視窗大小改變時自動重設畫布尺寸
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  // 重新計算選項按鈕寬度與 X 座標
  optionWidth = width * 0.6;
  optionX = (width - optionWidth) / 2;
}