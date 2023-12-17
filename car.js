class Car{
    constructor(x,y,width,height){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acc=0.2;
        this.maxSpeed=3;
        this.friction=0.05;
        this.angle=0;
        this.damage=false;

        
        this.sensor=new Sensor(this);

        this.controls=new Controls();

        this.img=new Image();
        this.img.src="car.png"


    }

    update(roadBorders){
        if(!this.damage){
            this.#move();
            this.polygon=this.#createPolygon();
            this.damage=this.#assesDamage(roadBorders);
        }
        this.sensor.update(roadBorders);
    }

    #assesDamage(roadBorders){
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }

    #move(){
                if(this.controls.forward){
            this.speed+=this.acc;
        }
        if(this.controls.reverse){
            this.speed-=this.acc;
        }

        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }

        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }

        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }

        if(this.speed!=0){
            const flip=this.speed>0?1:-1;
            if(this.controls.left){
                this.angle+=0.03*flip;
            }
    
            if(this.controls.right){
                this.angle-=0.03*flip;
            }
        }

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    draw(ctx,drawSensor=false){
        if(this.damage){
            ctx.fillStyle="grey";
        }else{
            ctx.fillStyle="black";
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for(let i=0;i<this.polygon.length;i++){
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.fill();

        // ctx.save();
        // ctx.translate(this.x,this.y);
        // ctx.rotate(-this.angle)


        // ctx.drawImage(this.img,
           // -this.width/2,
            // -this.height/2,
            // this.width,
            // this.height
        // );
            
        // ctx.beginPath();

        // ctx.restore();

        // if(this.sensor && drawSensor){
           //  this.sensor.draw(ctx);
        // }

        this.sensor.draw(ctx);
    }
}