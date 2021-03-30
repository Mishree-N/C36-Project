//variables
var dog,sadDog,happyDog;
var feed, stock;
var foodObj, foodS, foodStock;
var fedTime, lastFed;
var database;


function preload(){

  //load sad and happy dog images
  sadDog=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");

}

function setup() {
  //canvas
  createCanvas(1000,400);
  //declare database
  database=firebase.database();
  
  //create dog sprite & sad image
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  //create food
  foodObj=new Food();
  foodStock=database.ref("FoodStock");
  foodStock.on("value", readStock);
  feed=createButton("Feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);
  stock=createButton("Add Food");
  stock.position(800,95);
  stock.mousePressed(addFoods);

}

function draw() {
  //green background
  background(46,139,87);

  //display food
  foodObj.display();

  //refer to database for feed time
  fedTime=database.ref("FeedTime");
  fedTime.on("value", function (data){
                      lastFed=data.val();
                      });

  //text in white
  fill ("white");
  textSize(20);
  
  if (lastFed>=12){
    //text display for PM time
    text("Last Fed : " +  lastFed%12 + " PM", 350,30);
  } else if (lastFed==0){
    //text for 12 am last fed time
    text ("Last Fed : 12 AM", 350, 30);
  } else {
  //text display for AM time
  text("Last Fed : " +  lastFed + " AM", 350,30);
  }

  //show sprites
  drawSprites();
}

//function to read food Stock
function readStock(data){

  foodS=data.val();
  foodObj.updateFoodStock(foodS);
  console.log(foodS);
  
}


//function to update food stock and last fed time
function feedDog(){

  dog.addImage(happyDog);

  if (foodObj.getFoodStock()<=0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  } else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  database.ref("/").update({FoodStock:foodObj.getFoodStock(),
    FeedTime:hour()});
  
}


//function to add food in stock
function addFoods(){

  foodS++;
  database.ref("/").update({FoodStock:foodS});

}
