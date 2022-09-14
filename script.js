(function() {
    const MAIN_MENU_SECTION = document.querySelector('.main_menu');
    const MAIN_CONTENT = document.querySelector('.main_container'); // Card field
    const startBtn = document.querySelector('#start_btn'); // Start game button
    const BACK_TO_TOP = document.querySelector('#backToSettings'); // Back to settings
    let CONTENT_ITEMS; // Get cards

    // Settings
    let interval;
    let verticalNum,
        horizontalNum;
    const numberOfCards = document.querySelectorAll('.select_input'); // Horizontal and vertical inputs
    const addTimer = document.querySelector('#select_timer'); // Add timer checkbox
    const timer = document.querySelector('#main_timer'); // Timer of game

    startBtn.addEventListener('click', getSettings);

    // Get settings of the game
    function getSettings() {
        verticalNum = document.querySelector('#select_vert_number'); // Vertical Number of Cards
        horizontalNum = document.querySelector('#select_horiz_number'); // Horizontal Number of Cards

        for (let index = 0; index < numberOfCards.length; index++) {
            if(numberOfCards[index].value % 2 == 0){
                continue;
            }else{
                verticalNum.value = '4';
                horizontalNum.value = '4';

                startBtn.classList.add('wrong');
                setTimeout(()=>{
                    startBtn.classList.remove('wrong');
                }, 1000);

                return;
            }
        }

        createCards(verticalNum.value, horizontalNum.value); // Creating random cards on the field
        calcContentWidth(horizontalNum.value); // Container Width Calculation

        setTimeout(()=>{
            MAIN_MENU_SECTION.classList.add('hidden');
        }, 500);

        startBtn.setAttribute('disabled', '');
    }

    // Cards generation
    function createCards(numOfVertCards, numOfHorizCards) {
        let arrNums = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10,
                    11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20,
                    21, 21, 22, 22, 23, 23, 24, 24, 25, 25, 26, 26, 27, 27, 28, 28, 29, 29, 30, 30,
                    31, 31, 32, 32, 33, 33, 34, 34, 35, 35, 36, 36, 37, 37, 38, 38, 39, 39, 40, 40,
                    41, 41, 42, 42, 43, 43, 44, 44, 45, 45, 46, 46, 47, 47, 48, 48, 49, 49, 50, 50,];
        let shuffleArr = []; // Jumbled array of cards
        let condition = 100 - (numOfVertCards * numOfHorizCards); // Condition for cycle

        // Removing unwanted cards
        for (let index = 0; index < condition; index++) {
            arrNums.pop();
        }

        let count = arrNums.length;

        // Array shuffling
        while(count){
            // Fisher-Yates algorithm
            let elem = Math.floor(Math.random() * count--);
            shuffleArr.push(arrNums.splice(elem, 1)[0]);
        }

        // Reset field to initial state
        MAIN_CONTENT.innerHTML = `<div class="main_popup"><h1 class="main_popup_title over">GAME OVER</h1>
        <h1 class="main_popup_title win">YOU WON</h1></div>`;

        // Create cards
        for (let index = 0; index < shuffleArr.length; index++) {
            MAIN_CONTENT.innerHTML += `<div class="main_item">
                                            <div class='front_item'><i class="fas fa-question"></i></div>
                                            <span>${shuffleArr[index]}</span>
                                        </div>`;
        }

        // Add timer
        if(addTimer.checked){
            timer.classList.add('active');
        }else{
            timer.classList.remove('active');
            timer.innerHTML = '1:00';
        }

        CONTENT_ITEMS = document.querySelectorAll('.main_item'); // Get cards

        setTimer();
        cardEvent();
    }

    function setTimer(){
        if(timer.classList.contains('over')){
            timer.classList.remove('over');
            timer.classList.add('active');
        }

        let time = 5; // Time(seconds)

        if(addTimer.checked){
            interval = setInterval(()=>{
                let minutes = Math.floor(time / 60); // Calculate minutes of timer
                let seconds = time % 60; // Calculate seconds of timer
                seconds = seconds < 10 ? '0' + seconds : seconds;
                time--;

                timer.innerHTML = `${minutes}:${seconds}`;

                if(time < 0){
                    timer.classList.remove('active');
                    timer.classList.add('over');
                    endGame();
                    clearInterval(interval);
                }
            }, 1000);
        }
    }

    // Game logic
    function cardEvent() {
        let flippedCard = false; // Flipped card or not
        let cardsLocked = false; // Field click blocking
        let firstCard, secondCard; // Card memorization

        for (let index = 0; index < CONTENT_ITEMS.length; index++) {
            CONTENT_ITEMS[index].addEventListener('click', flipCard);

            // Card event on click
            function flipCard(){
                if(timer.innerHTML === '0:00'){
                    cardsLocked = true;
                    endGame();
                }

                // Click block
                if(cardsLocked) return;

                // Card animation on click
                (function() {
                    if(!CONTENT_ITEMS[index].classList.contains('active')){
                        CONTENT_ITEMS[index].classList.add('active');
                    }
    
                    if(CONTENT_ITEMS[index].classList.contains('animation')){
                        CONTENT_ITEMS[index].classList.remove('animation');
                    }
                })();

                // Card comparison
                if(!flippedCard){
                    flippedCard = true;
                    firstCard = CONTENT_ITEMS[index];
                }else{
                    flippedCard = false;
                    secondCard = CONTENT_ITEMS[index];

                    // Cards comparison
                    (function() {
                        let firstChild = +firstCard.children[1].textContent; // Finding content of the first card which we gonna compare with second card
                        let secondChild = +secondCard.children[1].textContent; // Finding content of the second card which we gonna compare with first card
                        if(firstChild === secondChild){
                            firstCard.removeEventListener('click', flipCard);
                            secondCard.removeEventListener('click', flipCard);
                        }else{
                            // Click blocking
                            cardsLocked = true;

                            // Animation when cards doesn't match
                            setTimeout(()=>{
                                firstCard.classList.remove('active');
                                firstCard.classList.add('animation');
                                secondCard.classList.remove('active');
                                secondCard.classList.add('animation');

                                cardsLocked = false;
                            }, 500);
                        }
                    })();
                }

                endGame();
            }
            
        }
    }

    // Container Width Calculation
    function calcContentWidth(numOfCards) {
        MAIN_CONTENT.style.maxWidth = `${(numOfCards * (110 + 20)) + 40}px`;
    }

    // End Game event
    function endGame(){
        const PLAY_AGAIN_BTN = document.querySelector('#againBtn'); // 'Play again' button
        const popup = document.querySelector('.main_popup'); // Popup window when you won or lose
        let result = true;

        // Popup when the user has won
        function win(){
            popup.classList.add('active');
            popup.classList.add('win');
        }

        // Popup when the user has lost
        function over(){
            popup.classList.add('active');
            popup.classList.add('over');
        }

        // End of the game
        if(timer.innerHTML === '0:00'){
            // When time is over
            over();
            PLAY_AGAIN_BTN.removeAttribute('disabled');
        }else{
            // Are all the cards turned over
            for (let index = 0; index < CONTENT_ITEMS.length; index++) {
                if(CONTENT_ITEMS[index].classList.contains('active')){
                    result = true;
                }else{
                    result = false;
                    break;
                }
                
                if(result && index >= CONTENT_ITEMS.length - 1){
                    PLAY_AGAIN_BTN.removeAttribute('disabled');
                    win();
                    clearInterval(interval);
                }
            }
        }

        // Reset to initial state
        PLAY_AGAIN_BTN.addEventListener('click', () => {
            // Hide popup
            popup.classList.remove('active');
            popup.classList.remove('over');
            popup.classList.remove('win');

            // Restarting the game
            clearInterval(interval);
            createCards(verticalNum.value, horizontalNum.value);

            PLAY_AGAIN_BTN.setAttribute('disabled', '');
        });
        
        BACK_TO_TOP.addEventListener('click', () =>{
            MAIN_MENU_SECTION.classList.remove('hidden'); // Open settings
    
            // Hide popup
            popup.classList.remove('active');
            popup.classList.remove('over');
            popup.classList.remove('win');
    
            clearInterval(interval); // Reset timer
    
            startBtn.removeAttribute('disabled');
            BACK_TO_TOP.setAttribute('disabled', '');
            
            // Reset field to initial state
            setTimeout(()=>{
                MAIN_CONTENT.innerHTML = `<div class="main_popup"><h1 class="main_popup_title over">GAME OVER</h1>
            <h1 class="main_popup_title win">YOU WON</h1></div>`;
    
                BACK_TO_TOP.removeAttribute('disabled');
            }, 500);
        });
    }
})();