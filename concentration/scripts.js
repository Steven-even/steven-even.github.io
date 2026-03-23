//Concentration JavaScript




//run this code when the DOM loads
document.addEventListener('DOMContentLoaded', function (e) {

    //radomize the order of the cards
    let allCards = Array.from(document.querySelectorAll('.outerCard'));
    let gameBoard = document.querySelector('#gameBoard');

    //loop through all the cards
    for (x=0; x < allCards.length; x++) {
        let randNum = Math.floor( Math.random() * allCards.length);
        gameBoard.insertBefore(  allCards[x], gameBoard.children[randNum]);
        
    }

});