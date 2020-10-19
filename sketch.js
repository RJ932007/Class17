    var trex, trex_running, trex_collided;
    var ground, invisibleGround, groundImage;
    var clouds,cloud;
    var o1,o2,o3,o4,o5,o6;
    var score=0;
    var PLAY=1;
    var END=0;
    var gamestate=PLAY;
    var obstacleGroup,cloudGroup;
    var trex_collidedImage;
    var restart,restartImage;
    var gameover,gameoverImage;
    var checkPoint,Jump,Die;
    var Dino;
    var BirdImage;
    localStorage["HighestScore"]=0;

function preload() {
  
//Loading Images
  
    trex_running = loadAnimation("trex1.png", "trex3.png",     "trex4.png");
    trex_collidedImage=loadAnimation("trex_collided.png");
    groundImage = loadImage("ground2.png");
    cloudImage = loadImage("cloud.png");
    o1=loadImage("obstacle1.png");
    o2=loadImage("obstacle2.png");
    o3=loadImage("obstacle3.png");
    o4=loadImage("obstacle4.png");
    o5=loadImage("obstacle5.png");
    o6=loadImage("obstacle6.png");
    gameoverImage=loadImage("gameOver.png");
    restartImage=loadImage("restart.png");
    Dino=loadAnimation("Dino.png");
    BirdImage=loadAnimation("Bird.png");
    
//Loading Sounds 
  
  checkPoint=loadSound("checkPoint.mp3");
  Jump=loadSound("jump.mp3");
  Die=loadSound("die.mp3");
  
}

function setup() {
    createCanvas(600, 200);

    //create a trex sprite
  
    trex = createSprite(50,160,20,50);
    trex.addAnimation("running", trex_running);
    trex.addAnimation("collided",trex_collidedImage);
    trex.addAnimation("ducking",Dino);
    
    trex.scale = 0.5;
    trex.setCollider("circle",-5,0,30);
    
    //create a ground sprite
    
    ground = createSprite(200,180,400,20);
    ground.addImage(groundImage);
    ground.x = ground.width /2;
    
    //Creating Invisible Ground.
  
    invisibleGround = createSprite(200,195,400,20);
    invisibleGround.visible=false;
  
    //Restart
  
    restart=createSprite(300,120)
    restart.addImage(restartImage);
    restart.scale=0.5;
    restart.visible=false;
  
    //Game Over
  
    gameover=createSprite(300,80);
    gameover.addImage(gameoverImage);
    gameover.scale=0.5;
    gameover.visible=false;
  
    //Creating Groups.
    obstacleGroup=new Group(); 
    cloudGroup=new Group();
    crowGroup=new Group();
  
}

function clouds() {
  
  if(frameCount%90===0){
    
    var cloud = createSprite(600,100,20,20);
    cloud.addImage(cloudImage);
    cloud.scale = 0.7;
    cloud.velocityX=-3;
    cloud.y=Math.round(random(80,110));
    cloud.lifetime=210;
    
    //Function for avoiding the overlapping of clouds over     trex
    
    cloud.depth=trex.depth;
    trex.depth=trex.depth+1;
    
    cloudGroup.add(cloud);
  }
}

function crow(){
  
  if (frameCount%80===0){
    
    var                       Bird=createSprite(600,Math.round(random(120,165)));
    Bird.addAnimation("Flying",BirdImage);
    Bird.velocityX=-(6+(score/100));
    Bird.lifetime=210;
    Bird.scale=0.1;
    
//Adding bird/crow to Crow Group
    
    crowGroup.add(Bird);
  }
  
}
function obstacles(){
  
  if(frameCount%75===0){
    
    var ob= createSprite(600,164,20,20);
    var r=Math.round(random(1,6));
    switch(r){
        
      case 1:ob.addImage(o1);
      break;
      case 2:ob.addImage(o2);
      break;
      case 3:ob.addImage(o3);
      break;
      case 4:ob.addImage(o4);
      break;
      case 5:ob.addImage(o5);
      break;
      case 6:ob.addImage(o6);
      break;  
      default:break;
    }
    ob.scale=0.5;
    ob.velocityX=-(4+(score/100));
    ob.lifetime=150;
    
    obstacleGroup.add(ob);
    
  }
  
}

function reset(){
  
  gamestate=PLAY;
  obstacleGroup.destroyEach();
  cloudGroup.destroyEach();
  trex.changeAnimation("running");
  gameover.visible=false;
  restart.visible=false;
  ground.velocityX=-4;

//Checking Highest Score
  
  if(localStorage["HighestScore"]<score){
    
    localStorage["HighestScore"]=score;
    
  }
  score=0;
  crowGroup.destroyEach();
  
  
}

function draw() {
    background("white");
  
if (gamestate===PLAY){
    
    ground.velocityX =-(4+(score/100));
    
if(keyWentDown("d")){
  
  trex.changeAnimation("ducking");
  trex.scale=0.15;
}

if(keyWentUp("f")){
  
  trex.changeAnimation("running");
  trex.scale=0.5;
}
if (score%100===0 && score>0){
  
  checkPoint.play();
}
if (keyDown("space") && trex.y>160) {
    
    Jump.play();
    trex.velocityY = -13;
      
}

    trex.velocityY = trex.velocityY + 0.8

  if (ground.x < 0) {
  
    ground.x = ground.width / 2;
  
}
    
  clouds();
  
if (score%700>0 && score%700<400){
  
  obstacles();
  
}

else
  crow();
  
  
  score=score+Math.round(frameRate()/55);
    
  if (obstacleGroup.isTouching(trex) || crowGroup.isTouching(trex)){
    
  trex.scale=0.5
    Die.play();
    gamestate=END;
    
  }
    
  }
  
  if (gamestate===END){
    
    trex.changeAnimation("collided");
    ground.velocityX=0;
    trex.velocityY=0;
    cloudGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
    obstacleGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    gameover.visible=true;
    restart.visible=true;
    
    if(mousePressedOver(restart)){
      
      reset();
      
    }
  }
  

  textSize(15);
  stroke("black");
  fill("black");
  text("Score "+score,500,50);
  text("Highest Score "+localStorage["HighestScore"],360,50);
  
  
    trex.collide(invisibleGround);
    
    
  
    drawSprites();
  
  
}