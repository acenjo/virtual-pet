var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var gameState, readState          

function preload(){
sadDog=loadImage("Images/Dog.png");
happyDog=loadImage("Images/happy dog.png");
garden = loadImage("Images/Garden.png")
bedroom = loadImage("Images/Bed Room.png")
washroom = loadImage("Images/Wash Room.png")
}

function setup() {
  database=firebase.database();
  createCanvas(1000,800);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });

  
  
  dog=createSprite(200,400,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
   
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);
  
  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(46,139,87);
  foodObj.display();

   currentTime = hour()
   if(currentTime===(lastFed + 1)){
     update("play")
     foodObj.garden()
   }
   else if(currentTime === (lastFed + 2)){
     update("sleeping")
     foodObj.bedroom()
   }
   else if(currentTime > (lastFed + 2) && currentTime <= (lastFed + 4)){
     update("bathing")
     foodObj.washroom()
   }
   else{
     update("hungry")
     foodObj.display()
   }
   if(gameState !== "hungry"){
     feed.hide()
     addFood.hide()
     dog.remove()
   }
   else{
     feed.show()
     addFood.show()
     dog.addImage(sadDog)
   }
  
   
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);
  
  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(), 
    gameState: "Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

function update(state){
   database.ref('/').update({
     gameState: state
   })
}