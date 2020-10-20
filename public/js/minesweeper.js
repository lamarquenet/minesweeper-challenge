const createNewGame = () =>{
    const input1 = document.getElementById("minesweeperLevel1").checked;
    const input2 = document.getElementById("minesweeperLevel2").checked;
    const body = input1? {height: 9, width:9, mines:11} : {height: 15, width:15, mines:40};
    fetch( '/game/newGame',{method:'POST' ,headers: { "Content-Type": "application/json" }, body:JSON.stringify(body)})
        .then(res => location.reload())
        .catch(err => console.log(err))
}

const sendOrder = async(posX, posY, action) =>{
    const body = JSON.stringify({posY: parseInt(posY), posX:parseInt(posX), action:action});
    const response = await fetch( '/game/updateCell',{method:'PUT' ,headers: { "Content-Type": "application/json" }, body:body})
    const data = await response.json();
    if(!data.error){
        if(data.gameOver){
            alert("Your Game Is Over, you need to create a new one.");
        }
        else{
            data.forEach(cell =>{
                let imageType = cell.isRevealed ? "/img/bg_down.png" : "/img/bg_closed.png";
                imageType = cell.isFlagged ? "/img/red_flagged.png" : imageType;
                imageType = cell.isBomb ? "/img/icon_mine.png" : imageType;
                document.getElementById(cell.posX+"-"+cell.posY).src = imageType;
                if(cell.isBomb){
                    alert("Kaboom, you are dead.");
                }
            })
        }
    }
    else{
        console.error(data);
        alert("order failed to execute");
    }
}

function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete" || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

docReady(function() {
    // DOM is loaded and ready for manipulation here
    document.getElementsByClassName("main")[0].addEventListener('contextmenu', function(event) {
        // If the clicked element doesn't have the right selector, bail
        if (!event.target.matches('.cell')) return;

        event.preventDefault();
        //if first right click the action is red_flag, if it is already redFlagged the action is question_mar, if you right
        //click a question mark we should return back to normal the square
        let action = "red_flag";
        if(event.target.dataset.isflagged === "true"){
            action = "question_mark";
        }
        else if(event.target.dataset.isquestioned === "true"){
            action = "clean";
        }



        sendOrder(event.target.dataset.posx, event.target.dataset.posy, action);
    }, false);

    document.getElementsByClassName("main")[0].addEventListener('click', function (event) {
        // If the clicked element doesn't have the right selector, bail
        if (!event.target.matches('.cell')) return;

        sendOrder(event.target.dataset.posx, event.target.dataset.posy, "reveal");

    }, false);
});
