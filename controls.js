class Controls{
    constructor(){
        this.forward=false;
        this.reverse=false;
        this.right=false;
        this.left=false;

        this.#addKeyboardListeners();

    }

    #addKeyboardListeners(){
        document.onkeydown=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.left=true;
                    break;
                case "ArrowRight":
                    this.right=true;
                    break;    
                case "ArrowUp":
                    this.forward=true;
                    event.preventDefault(); // Prevent default behavior (scrolling)
                    break;
                case "ArrowDown":
                    this.reverse=true;
                    event.preventDefault(); // Prevent default behavior (scrolling)
                    break;    
            }
            console.table(this);
        }
        document.onkeyup=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.left=false;
                    break;
                case "ArrowRight":
                    this.right=false;
                    break;    
                case "ArrowUp":
                    this.forward=false;
                    break;
                case "ArrowDown":
                    this.reverse=false;
                    break;    
            }
            console.table(this);
        }
    }
    
}