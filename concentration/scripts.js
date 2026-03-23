//Concentration JavaScript


//track number of turns
let playerClicks = 0;

//cleared clicked classes after delay
function clearClicks(){
    let allClickedCards = document.querySelectorAll(".clicked");
    for(let eachCard of allClickedCards){
        eachCard.classList.remove('clicked');
        
    }
    //increase player count by 1
    playerClicks++;
    document.querySelector("#playerTurnCounter span").innerHTML = playerClicks;

    //check for win
    let allCards = document.querySelectorAll(".outerCard");
    let matchedCards = document.querySelectorAll(".matched");
    if (matchedCards.length === allCards.length) {
        //player has won
        document.querySelector("#winning").innerHTML = "You won!";
        document.querySelector("#winning").style.display = "block";
    }
}
//Function to flip card when clicked
function flipCard() {
    
    if (!this.classList.contains("matched")){
    //get all the clicked cards
    let allClickedCards = document.querySelectorAll(".clicked");

    //only proceed if thre are less than 2 cards
    if (allClickedCards.length < 2) {
        //add clicked class to clocked cards
        this.classList.add('clicked');
    }



    //get a fresh list of new cards
    allClickedCards = document.querySelectorAll(".clicked");

    //if its a pair, compare the two cards
    if (allClickedCards.length === 2){

        //get the class list of card
        let card1 = allClickedCards[0].querySelector('h2').textContent;
        let card2 = allClickedCards[1].querySelector('h2').textContent;

        if(card1 === card2){
            console.log("match");
            allClickedCards[0].classList.add('matched');
            allClickedCards[1].classList.add('matched');
            window.setTimeout(clearClicks, 1000);
    }else{
            console.log("no match");
            window.setTimeout(clearClicks, 1000);
    }
    }
}
}


//run this code when the DOM loads
document.addEventListener('DOMContentLoaded', function (e) {

    //get hanldes to game elements
    let allCards = Array.from(document.querySelectorAll('.outerCard'));
    let gameBoard = document.querySelector('#gameBoard');

    //randomize cards by loop through all the cards
    for (x = 0; x < allCards.length; x++) {
        //randomize cards by reinserting them in ramdom spots
        let randNum = Math.floor(Math.random() * allCards.length);
        gameBoard.insertBefore(allCards[x], gameBoard.children[randNum]);

        //called flipped cards
        allCards[x].addEventListener('click', flipCard);
    }



});