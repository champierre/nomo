let ball;
let animationProgress = 0;
const animationDuration = 120; // 2秒間（60fps × 2）
const approachDuration = 240; // 4秒間（60fps × 4）
let isAnimating = false;
let hasAnimated = false;
let currentPhase = 0; // 0: フォークボール, 1: 接近アニメーション
let randomNumber = 0;
let ballImage;
let video;
let isVideoPlaying = false;
let isFirstPlay = true;

function setup() {
    createCanvas(windowWidth, windowHeight);
    // ボールの画像を読み込む
    ballImage = loadImage('ball.png');
    
    // 動画を読み込む
    video = createVideo('nomo.mp4', () => {
        video.size(windowWidth, windowHeight);
        video.style('position', 'absolute');
        video.style('top', '0');
        video.style('left', '0');
        video.style('z-index', '1');
        // 動画の終了イベントを設定
        video.elt.addEventListener('ended', () => {
            console.log('動画終了');
            isVideoPlaying = false;
            video.style('display', 'none');
            video.hide();
            startAnimation();
        });
    });
    
    ball = {
        x: windowWidth * 0.3,
        y: -windowHeight * 0.2,
        size: 50,
        rotation: 0,
        visible: false
    };
    
    // スタートボタンのイベントリスナーを設定
    document.getElementById('startButton').addEventListener('click', handleStart);
}

function handleStart() {
    if (!hasAnimated) {
        if (isFirstPlay) {
            // 初回のみ動画を再生
            isFirstPlay = false;
            startVideo();
        } else {
            // 2回目以降は直接アニメーションを開始
            startAnimation();
        }
    }
}

function startVideo() {
    isVideoPlaying = true;
    // 動画を再生
    video.play();
    console.log('動画再生開始');
}

function startAnimation() {
    isAnimating = true;
    animationProgress = 0;
    ball.visible = true;
    currentPhase = 0;
    // 1から30までのランダムな数字を生成
    randomNumber = Math.floor(Math.random() * 30) + 1;
    // スタートボタンを非表示
    document.getElementById('startButton').style.display = 'none';
}

function showStartButton() {
    document.getElementById('startButton').style.display = 'block';
    hasAnimated = false; // アニメーションを再度実行可能に
}

function draw() {
    background(0);
    
    // 動画が再生中でない場合のみアニメーションを描画
    if (!isVideoPlaying && isAnimating) {
        // アニメーションの進行度を更新
        animationProgress++;
        
        if (currentPhase === 0) {
            // フォークボールフェーズ
            if (animationProgress >= animationDuration) {
                // フェーズ1に移行
                currentPhase = 1;
                animationProgress = 0;
                // ボールを画面奥に配置
                ball.x = 0;
                ball.y = 0;
                ball.size = 20;
                ball.rotation = 0;
                return;
            }
            
            const progress = animationProgress / animationDuration;
            
            // ボールの位置を計算
            if (progress < 0.5) {
                // 開始位置から中央上方まで
                const t = progress / 0.5;
                ball.x = lerp(windowWidth * 0.3, 0, t);
                ball.y = lerp(-windowHeight * 0.2, -windowHeight * 0.4, t);
                ball.rotation = lerp(0, 1800, t); // 5回転
                ball.size = lerp(50, 70, t);
            } else {
                // 中央上方から左下へ急激に落下
                const t = (progress - 0.5) / 0.5;
                ball.x = lerp(0, -windowWidth * 0.5, t);
                ball.y = lerp(-windowHeight * 0.4, windowHeight, t);
                ball.rotation = lerp(1800, 3600, t); // さらに5回転
                // より急激なサイズ変化
                ball.size = lerp(70, 250, t * t * t);
            }
        } else {
            // 接近アニメーションフェーズ
            if (animationProgress >= approachDuration) {
                isAnimating = false;
                hasAnimated = true;
                
                // すぐにスタートボタンを表示
                showStartButton();
                return;
            }
            
            const progress = animationProgress / approachDuration;
            
            // 最後の0.1秒間は完全に停止
            if (progress > 0.9) {
                ball.size = 500;
                ball.rotation = 0;
            } else {
                // 画面奥から手前に向かって接近
                ball.size = lerp(20, 500, progress * progress * progress);
                ball.rotation = lerp(0, 3600, progress); // 10回転
            }
        }
    }
    
    // ボールを描画（visibleがtrueの場合のみ）
    if (!isVideoPlaying && ball.visible) {
        push();
        translate(ball.x + windowWidth/2, ball.y + windowHeight/2);
        rotate(radians(ball.rotation));
        imageMode(CENTER);
        image(ballImage, 0, 0, ball.size, ball.size);
        
        // 数字を描画（接近アニメーションフェーズの場合のみ）
        if (currentPhase === 1) {
            fill(0); // 数字の色を黒に
            textAlign(CENTER, CENTER);
            textStyle(BOLD);
            textSize(ball.size * 0.4); // ボールのサイズに応じて文字サイズを調整
            text(randomNumber.toString(), 0, 0);
        }
        pop();
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    // 動画のサイズも更新
    video.size(windowWidth, windowHeight);
    // ウィンドウサイズが変更された時にボールの開始位置を更新
    if (!isAnimating) {
        ball.x = windowWidth * 0.3;
        ball.y = -windowHeight * 0.2;
    }
} 
