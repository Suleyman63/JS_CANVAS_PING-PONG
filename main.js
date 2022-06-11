(function(){

    function el(css){
        return document.querySelector(css);
    };


const co = el('#game')
const ctx = co.getContext('2d')


// rechteckigen Bereich
function drawCan(x,y,w,h,col){
    ctx.fillStyle = col;
    ctx.fillRect(x,y,w,h)

}

// weißer Mittelpunkt 
function drawPunkt(x,y,r,col){
    ctx.fillStyle=col
    ctx.beginPath()
    ctx.arc(x,y,r,0, 2*Math.PI, false)
    ctx.closePath()
    ctx.fill()
}


// Kreis function
function drawKreis(x,y,r,w,col){
    ctx.strokeStyle=col
    ctx.lineWidth = w
    ctx.beginPath()
    ctx.arc(x,y,r,0,2 * Math.PI)
    ctx.closePath()
    ctx.stroke()
}


// score tabella function
function drawText(text,x,y,col){
    ctx.fillStyle = col
    ctx.font = '50px arial'
    ctx.fillText(text,x,y)

}


// user object
const user = {
    x : 20,
    y : 200,
    w : 5,
    h : 100,
    col : '#fff',
    score : 0
}


// computer object
const com = {
    x : 580,
    y : 200,
    w : 5,
    h : 100,
    col : '#fff',
    score : 0
}


// Ball object
const ball = {
    x : 300,
    y : 200,
    r : 10,
    col : 'brown',
    speed : 5,
    velX : 3,
    velY : 4,
    stop : true
}

// user line Move function
function moveUser(e){
    let rect = co.getBoundingClientRect()
    user.y = e.clientY - rect.top - user.h/2
    ball.stop = false
}
co.addEventListener('mousemove', moveUser)
    

// function Kollisionsbereich des Balls 
function kollision(b,p){
    // ball wert
    b.top = b.y - b.r
    b.bottom = b.y + b.r
    b.left = b.x - b.r
    b.right = b.x + b.r

    // player wert
    p.top = p.y
    p.bottom = p.y + p.h
    p.left = p.x
    p.right = p.x + p.w

    return (b.top < p.bottom && b.bottom > p.top && b.left < p.right && b.right > p.left)
}

// reset Ball function Ball kommt wieder an der mitte
const resetBall = () => {
    ball.x = co.width/2
    ball.y = co.height/2

    ball.speed = 5
    ball.velX = 3
    ball.velY = 4
    ball.stop = true
}

// update function 
function update(){

    // des Balls speed auf der X und Y gesammelt
    if(!ball.stop){
        ball.x += ball.velX
        ball.y += ball.velY
    }

    // wenn Ball große als höhe lauft zurück oder vorne
    if(ball.y + ball.r > co.height || ball.y - ball.r < 0)
    ball.velY = -ball.velY


    // Computer line move
    let comMove =0.1
    com.y += (ball.y - (com.y + com.h/2)) * comMove

    // ball neben den Computer oder User
    let player = (ball.x < co.width/2) ? user : com

    // ball und player intersect
    if(kollision(ball,player)){
        let intersectY = ball.y - (player.y + player.h/2)
        intersectY /= player.h/2
        
        // des Ball speed und direction X oder Y 
        let maxBounceRate = Math.PI / 3
        let bounceAngle = intersectY * maxBounceRate

        let direction = (ball.x < co.width/2) ? 1 : -1

        ball.velX = direction * ball.speed * Math.cos(bounceAngle)
        ball.velY = ball.speed * Math.sin(bounceAngle)

        ball.speed += 2
    }
    // wenn keine Kollision ball reset
    if(ball.x >  co.width){
        user.score++
        resetBall()
    }else if(ball.x < 0){
        com.score++
        resetBall()
    }
    
}

// new game function 
function neueSpiel(){
    user.score=0;
    com.score=0;
    resetBall()  
}
el('#neueSpiel').addEventListener('click', neueSpiel)


// stop function
function pause(){
    clearInterval(a)
}
el('#pause').addEventListener('click', pause)


// start function
function st(){
    a = setInterval(spiel,1000/ps)

}
el('#start').addEventListener('click', st)


// render function
function render(){

    // Rechteckigen Bereich und Mittelline
    drawCan(0,0,600,400,'darkgreen')
    drawCan(300,0,4,400,'#fff')

    // Kreis und weiser Mittelpunkt
    drawPunkt(300, 200,8,'#fff')
    drawKreis(300, 200,50,4,'#fff')

    // score tabella
    drawText(user.score, 150,50,'#fff')
    drawText(com.score, 450,50,'#fff')

    // user und computer line
    drawCan(user.x, user.y, user.w, user.h, user.col)
    drawCan(com.x, com.y, com.w, com.h, com.col)

    // Ball
    drawPunkt(ball.x, ball.y, ball.r, ball.col)      
}


function spiel(){
    update()
    render()
}

const ps = 50 // speed pro sekunde
let a = setInterval(spiel,1000/ps)


}());