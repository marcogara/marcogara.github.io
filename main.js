const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;

const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=500;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");
const road=new Road(carCanvas.width/2,carCanvas.width*0.9);

const N=1;
const cars=generateCars(N);
let bestCar=cars[0];

localStorage.clear();

 if(!localStorage.getItem("beenHereBefore")){
     localStorage.setItem("beenHereBefore","true");
     // new from test, trained for more traffic 25.12.23
     // localStorage.setItem("bestBrain",'{"levels":[{"inputs":[0.28117921522495914,0.6109769945757191],"outputs":[1,0,1,0,1,1],"biases":[-0.19596443005700298,0.167442396385859,-0.24038681767932424,0.18652478898533909,-0.17056778825873464,-0.2035858808497264],"weights":[[-0.2409411391817989,0.04940774745435655,0.14762716734924897,0.04257722083852682,0.16180375589962523,-0.12667659858515196],[0.04551152073545422,0.1971303904831351,0.0002489031553003897,-0.14871953207995006,0.16802559062881603,0.07744670474239948],[0.13607995763549877,0.2710553322040837,-0.20495105021498217,-0.2038278071679547,-0.13775493282237683,0.06121946023448137],[0.11630704153105512,-0.2006895446100145,-0.1966273620138163,0.010268226824443949,-0.14041060039088224,-0.0545405200378587],[-0.0864151957657878,0.1155841932744412,-0.07252572998134715,0.06721911116029751,-0.19999963871318108,0.036663262897163484]]},{"inputs":[1,0,1,0,1,1],"outputs":[1,1,1,0],"biases":[-0.164082016394052,-0.14803000715606712,-0.05291940047951312,0.1434798277523064],"weights":[[0.18329051687042322,-0.245480034263897,-0.15053911206077736,-0.23872739911451107],[0.11230856673147505,-0.12378662632384387,0.012470145587685041,-0.22860095311232062],[0.21705237933197113,0.2066803885870074,0.12617495525842798,-0.05637377075351489],[-0.032574416406950954,0.1813252302306618,0.006095860871826453,0.005759830723080901],[0.13968208819352715,-0.11353755575798814,0.36978071054989714,0.18405914061612152],[-0.09695931525930634,0.1235574350699837,-0.08174970971302563,0.1589619804051378]]}]}');
     localStorage.setItem("bestBrain",'{"levels":[{"inputs":[0.7134037395397386,0.4704391617329813,0,0,0],"outputs":[1,0,1,0,1,1],"biases":[-0.2857065784574137,0.15198050810320685,-0.13924253314793095,0.11578316440435818,-0.16178778119340148,-0.3000903730682978],"weights":[[-0.13515557540433842,0.07300698004528629,0.0040602602910803365,-0.06511672542187383,0.2351613353184897,-0.2012322725070096],[0.11375478789219415,0.19674169055322577,-0.10038853369062525,-0.08805459204957476,0.21925787393967702,0.15340538795108272],[0.006771304836725459,0.19973693546258126,-0.054730364561966574,-0.31855113026094745,-0.18011218120061373,-0.07367159677011853],[0.10788433228858771,-0.08604768151855152,-0.16601129743851203,-0.00019124113279275767,-0.2387343271874623,0.024133579587637094],[0.016549344407090646,0.07491472818610108,0.01776519928759422,0.061508369764843265,-0.22340799373690096,-0.04158178250497961]]},{"inputs":[1,0,1,0,1,1],"outputs":[1,1,1,0],"biases":[-0.06116069156441874,-0.0723274390864902,0.040602477018632524,0.36214587805918513],"weights":[[0.08902059474663654,-0.15740460212292795,-0.33036790341757627,-0.09502772355825113],[-0.025343350670927654,-0.3306790265709002,-0.015918008460683405,-0.3003507035765679],[0.3227266376583849,0.38057846051375693,0.18707727773028537,0.053444661926534916],[-0.2025644147140744,0.1184725671846302,-0.09069904024640596,-0.12430190885008531],[0.07527020196440684,-0.230469927588571,0.3007741658810536,0.22218297028978307],[-0.01361908920713352,0.16609276689516542,-0.09581290649261008,-0.039394098855477074]]}]}');
}

if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain,0.5);
        }
    }
}

const traffic=[
    new Car(road.getLaneCenter(1),-600,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-700,30,50,"DUMMY",2.2,getRandomColor()),
    new Car(road.getLaneCenter(2),-900,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-900,30,50,"DUMMY",2.2,getRandomColor()),
    new Car(road.getLaneCenter(1),-1200,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(1),-1400,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(0),-1400,30,50,"DUMMY",2.2,getRandomColor()),
    new Car(road.getLaneCenter(2),-1600,30,50,"DUMMY",1.9,getRandomColor()),
    new Car(road.getLaneCenter(2),-1800,30,50,"DUMMY",1.9,getRandomColor()),
    new Car(road.getLaneCenter(0),-2100,30,50,"DUMMY",2.2,getRandomColor()),
    new Car(road.getLaneCenter(2),-2100,30,50,"DUMMY",1.9,getRandomColor()),
    new Car(road.getLaneCenter(1),-2100,30,50,"DUMMY",2.1,getRandomColor()),
    new Car(road.getLaneCenter(2),-2100,30,50,"DUMMY",2.2,getRandomColor()),
    new Car(road.getLaneCenter(2),-2400,30,50,"DUMMY",2.2,getRandomColor()),
];

const traffic2=[
    new Car(road.getLaneCenter(1),-600,30,50,"DUMMY",1.8,getRandomColor()),
    new Car(road.getLaneCenter(0),-700,30,50,"DUMMY",2.1,getRandomColor()),
    new Car(road.getLaneCenter(2),-900,30,50,"DUMMY",2,getRandomColor()),
    new Car(road.getLaneCenter(2),-1600,30,50,"DUMMY",1.9,getRandomColor()),
    new Car(road.getLaneCenter(2),-1800,30,50,"DUMMY",1.9,getRandomColor()),
    new Car(road.getLaneCenter(2),-2100,30,50,"DUMMY",1.9,getRandomColor()),
    new Car(road.getLaneCenter(0),-2100,30,50,"DUMMY",2.3,getRandomColor()),
    new Car(road.getLaneCenter(2),-2100,30,50,"DUMMY",2.3,getRandomColor()),
    new Car(road.getLaneCenter(2),-2100,30,50,"DUMMY",2.4,getRandomColor()),

];
	


// Add a variable to track the y-value of the last traffic car
let lastTrafficY = -11000;

animate();

function save(){
    localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain));
}

function discard(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i=0;i<=N;i++){
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"))
    }
    return cars;
}

let isAnimating = false;


function animate(time){      


        for(let i=0;i<traffic.length;i++){
            traffic[i].update(road,[]);
        }
        for(let i=0;i<cars.length;i++){
            cars[i].update(road,traffic);
        }

    bestCar=cars.find(
        c=>c.fitness==Math.max(
            ...cars.map(c=>c.fitness)
        ));

    carCanvas.height=window.innerHeight-200;
    networkCanvas.height=window.innerHeight-200;

    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.7);

    road.draw(carCtx);
    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx);
    }

    // carCtx.globalAlpha=0.2;
    // for(let i=0;i<cars.length;i++){
    // cars[i].draw(carCtx);
    // }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,true);

    // Check if the conditions for resetting the y-values of existing traffic cars are met
             //console.log("Last traffic car y:", lastTrafficY);
             if (bestCar.y < lastTrafficY && lastTrafficY < window.innerHeight) {
                 // Reset the positions of existing traffic cars
                 //console.log("Resetting traffic...");
                 resetTraffic();
             }

    carCtx.restore();

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
    requestAnimationFrame(animate);
            
}



function resetTraffic() {

    traffic.length = 0; // Clear the current contents of the traffic array
    traffic.push(...traffic2); // Add all elements from traffic2 to traffic

    // Reset properties of each car in the traffic array
    for (let i = 0; i < traffic.length; i++) {
        traffic[i].y = -200;  // Reset the y position to a value above the canvas
        // Reset other properties as needed
    }

    // Reset properties of each car in the cars array
    for (let i = 0; i < cars.length; i++) {
        cars[i].y = 2000; // Reset the y position to the starting position

        // Reset other properties as needed
    }
    // Stop the current animation loop
    isAnimating = false;

     // Start a new animation loop after a short delay to allow the rendering engine to catch up
     setTimeout(() => {
        startAnimation();
    }, 100);
}


// Move the animation setup to a separate function
function startAnimation() {
    // Ensure that the animation is not already running
    if (!isAnimating) {
        isAnimating = true;
        requestAnimationFrame(animate);
    }
}

