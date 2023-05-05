let img;
function setup() {
  // Top-left corner of the img is at (0, 0)
  // Width and height are the img's original width and height
img = loadImage('mrberk.jpg'); // Load the image
}



var canvasx =400
var canvasy =400
var center = [canvasx/2,canvasy/2]
var boarddiam=350
var ballspeedx=Math.random()*20
var ballspeedy=Math.random()*20
console.log(ballspeedx,ballspeedy)
var ballsize=10
function setup() {
  createCanvas(canvasx, canvasy);
  ball=new BALL(center[0]+50,center[1],ballspeedx,ballspeedy)
  image(img, 0, 0);
}

function draw() {
  background(220);
  var a=boarddiam;
  ball.x+=ballspeedx
  ball.y+=ballspeedy
  if (ball.x<0+ballsize/2){
    ballspeedx*=-1
  }
  if (ball.y<0+ballsize/2){
    ballspeedy*=-1
  }
  if (ball.x>canvasx-ballsize/2){
    ballspeedx*=-1
  }
  if (ball.y>canvasy-ballsize/2){
    ballspeedy*=-1
  }
  ellipse(center[0],center[1],a,a)
  ellipse(ball.x,ball.y,ballsize,ballsize)
}

class BALL{
  constructor(x,y,speedx,speedy){
    this.x=x
    this.y=y
    this.speedx=speedx
    this.speedy=speedy
  }
}

