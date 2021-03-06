let timerInterval = null;

const createNewGame = async() =>{
    const input1 = document.getElementById("minesweeperLevel1");
    const input2 = document.getElementById("minesweeperLevel2");
    const input3 = document.getElementById("minesweeperLevel3");
    const selected = input1.checked? input1 : input2.checked? input2 : input3;
    const body = {height: +selected.dataset.size, width:+selected.dataset.size, mines:+selected.dataset.mines};
    const response = await fetch( '/game/newGame',{method:'POST' ,headers: { "Content-Type": "application/json" }, body:JSON.stringify(body)})
    const data = await response.json();
    await localStorage.setItem("LocalClockOffset", (Date.now() - parseInt(data.serverDate)).toString());
    location.reload()
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
    const gameObj = JSON.parse(game)
    if(gameObj.mines >= gameObj.unrevealedCells){
        alert("You won the game");
    }
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

    const timer =  document.getElementById("minesweeperTime");
    timerInterval = setInterval( () =>{
        if(game !== ""){
            const timeOffset = localStorage.getItem("LocalClockOffset");
            const timeToCompare = parseInt(gameFinished) == 0 ? Date.now() : parseInt(gameFinished) -parseInt(timeOffset);
            const seconds = Math.floor((timeToCompare - parseInt(timeOffset) - parseInt(serverTime)) /1000);
            const minutes = Math.floor((seconds /60));
            const hours =  Math.floor(minutes / 60)
            timer.innerHTML = (hours +":"+minutes%60+":"+(seconds %60));
        }
        else{ clearInterval(timerInterval) }
    }, 1000)


    document.getElementsByClassName("main")[0].addEventListener('click', function (event) {
        // If the clicked element doesn't have the right selector, bail
        if (!event.target.matches('.cell') || event.target.dataset.isrevelaed === "true") return;

        sendOrder(event.target.dataset.posx, event.target.dataset.posy, "reveal");

    }, false);

    const sendOrder = async(posX, posY, action) =>{
        const body = JSON.stringify({posY: parseInt(posY), posX:parseInt(posX), action:action});
        const response = await fetch( '/game/updateCell',{method:'PUT' ,headers: { "Content-Type": "application/json" }, body:body})
        const data = await response.json();
        if(!data.error){
            if(data.gameOver){
                clearInterval(timerInterval);
                alert(data.gameOver);
            }
            else if(data.victory){
                clearInterval(timerInterval);
                alert(data.victory);
            }
            else{
                data.forEach(cell =>{
                    let imageType = cell.isRevealed ? "/img/"+cell.nearMines+".png" : "/img/bg_closed.png";
                    imageType = cell.isFlagged ? "/img/red_flagged.png" : imageType;
                    imageType = cell.isQuestioned ? "/img/questioned.png" : imageType;
                    imageType = cell.isBomb ? "/img/icon_mine.png" : imageType;
                    let domCell = document.getElementById(cell.posX+"-"+cell.posY);
                    domCell.src = imageType;
                    if(domCell.dataset.isflagged !== cell.isFlagged.toString()){
                        let domFlagsCounter = document.getElementById("minesweeperFlags");
                        const addOrSubstract = cell.isFlagged? 1: -1;
                        domFlagsCounter.innerHTML = (parseInt(domFlagsCounter.innerHTML) + addOrSubstract).toString();
                    }
                    if(cell.isRevealed.toString() !== domCell.dataset.isrevealed){
                        gameObj.unrevealedCells--;
                    }
                    domCell.dataset.isflagged = cell.isFlagged;
                    domCell.dataset.isquestioned = cell.isQuestioned;
                    domCell.dataset.isrevelaed = cell.isRevealed;
                    if(cell.isBomb){
                        clearInterval(timerInterval);
                    }else if(gameObj.mines >= gameObj.unrevealedCells){
                        location.reload()
                    }
                })
            }
        }
        else{
            console.error(data);
            alert("order failed to execute");
        }
    }
});
