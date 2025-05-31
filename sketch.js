let ball;
let animationProgress = 0;
const animationDuration = 120; // 2秒間（60fps × 2）

function setup() {
    createCanvas(windowWidth, windowHeight);
    ball = {
        x: windowWidth * 0.3,
        y: -windowHeight * 0.2,
        size: 50,
        rotation: 0
    };
}

function draw() {
    background(0);
    
    // アニメーションの進行度を更新
    animationProgress = (animationProgress + 1) % animationDuration;
    const progress = animationProgress / animationDuration;
    
    // ボールの位置を計算
    if (progress < 0.5) {
        // 開始位置から中央上方まで
        const t = progress / 0.5;
        ball.x = lerp(windowWidth * 0.3, 0, t);
        ball.y = lerp(-windowHeight * 0.2, -windowHeight * 0.4, t);
        ball.rotation = lerp(0, 180, t);
        ball.size = lerp(50, 70, t);
    } else {
        // 中央上方から左下へ急激に落下
        const t = (progress - 0.5) / 0.5;
        ball.x = lerp(0, -windowWidth * 0.5, t);
        ball.y = lerp(-windowHeight * 0.4, windowHeight, t);
        ball.rotation = lerp(180, 360, t);
        // より急激なサイズ変化
        ball.size = lerp(70, 250, t * t * t); // 3乗することでさらに急激な変化を実現
    }
    
    // ボールを描画
    push();
    translate(ball.x + windowWidth/2, ball.y + windowHeight/2);
    rotate(radians(ball.rotation));
    fill(255);
    noStroke();
    ellipse(0, 0, ball.size);
    pop();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // ウィンドウサイズが変更された時にボールの開始位置を更新
    if (animationProgress === 0) {
        ball.x = windowWidth * 0.3;
        ball.y = -windowHeight * 0.2;
    }
} 
