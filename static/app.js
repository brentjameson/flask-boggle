submit = $('#submit-guess')
let timeLeft = 60;
clickCounter = 0;
let counter_keepScore = 0;
wordBank = []

function show_or_hide_element(idAndAction) {
    for(const [element,action] of Object.entries(idAndAction)){
        if(action === 'hide'){
            $(`#${element}`).hide()
        }
        if(action === 'show'){
            $(`#${element}`).show()
        }
    }
}


function change_element_text(idAndText) {
    for(const [element,text] of Object.entries(idAndText)){
            $(`#${element}`).text(text)
    }
}

function set_timeout_hide_element(element_id, action, time) {
    if( action === 'hide' ) {
        setTimeout(function(){$(`#${element_id}`).hide()
        }, time);
    }
    if( action === 'show' ) {
        setTimeout(function(){$(`#${element_id}`).show()
        }, time);
    }
}

function display_game(){
    if (clickCounter != 0) {
        location.reload();
        $('#word-bank').show()
    }
    show_or_hide_element({'guess-form': 'show', 'start-timer': 'hide'})
    $('.row').show()
    clickCounter++
} 

/** Handle start button click. Trigger start of timer */
function startGame(e) {
    e.preventDefault()

    show_or_hide_element({'timer': 'show', 'scoreboard': 'show', 'word-bank': 'show'})

    change_element_text({'timer': timeLeft, 'scoreboard': counter_keepScore})

    const gameCountDown = setInterval(function(){
        timeLeft--
        $('#timer').text(timeLeft)
        if(timeLeft === 0) {
            endGame(gameCountDown)
        }
    }, 1000);
    display_game()
    // for(let i = 0; i <=4; i++) {
    //     $(`.row-${i}`).css('float', 'left')
    // }
    $('.row-0[1]').css('background-color', 'red')
    $('.rows').show()
}

function endGame(gameCountDown) {
    show_or_hide_element({'scoreboard': 'hide', 'successAlert': 'hide', 'guess-form': 'hide', 'timer': 'hide', 'game-over': 'show' })

    change_element_text({})

    set_timeout_hide_element('game-over', 'hide', 2000)
    update_session(counter_keepScore)

    clearInterval(gameCountDown)

    $('#new-game').html('PLAY AGAIN')
    set_timeout_hide_element('start-timer', 'show', 2000)

    update_session(counter_keepScore)
}   

$('#start-timer').on('click', startGame)


function manageGame(e) {
    e.preventDefault();
    const word = $('input').val()
    $('#guess-form')[0].reset();
    if(timeLeft === 0 ) {
        ('#failureAlert').text(`You are out of time. Click "PLAY AGAIN" to start a new game.`).show()
        set_timeout_hide_element('failureAlert','hide',1000)
    }
    else if (word.length <= 2) {
        $('#failureAlert').text(`Your word must have 3 or more letters. Try Again!`).show()

        set_timeout_hide_element('failureAlert', 'hide',1000)
    }  
    else if (wordBank.includes(word)) {
        $('#failureAlert').text(`You've already used the word ${word}. Try Again!`).show()

        set_timeout_hide_element('failureAlert','hide',1000)
    }
    else {
        checkIfValidWord(word);
    }
};

$('#guess-form').on('submit', manageGame)


async function update_session(score) {
    let response = await axios({
        url: 'http://127.0.0.1:5000/update-session',
        method: 'POST',
        data: {'score': score }
    })
    high_score = response.data['high_score']
    gameCount = response.data['game_counter']

    if (response.data['new_high_score'] == true) {
        $('h1').text(`YOU SET A NEW HIGH SCORE WITH ${high_score} POINTS! CONGRATS JON!`).show()

        setInterval(function(){
            $("h1").animate({color: "red"}, "slow");
            $("h1").animate({color: "#000"}, "slow");
        },500);

    }
    else {
        $('h1').text(`Your final score is ${counter_keepScore}`).show()
    }
}


async function checkIfValidWord(word) {
    if(timeLeft === 0 ) {
        return
    }
    const entry = {
        guess: word
    }
    let response = await axios({
        url: 'http://127.0.0.1:5000/check-guess',
        method: 'POST',
        data: entry
    })
    const res = response.data

    if(res === 'not-word') {
        $('#failureAlert').text(`${word} is not a word. Try Again!`).show()

        set_timeout_hide_element('failureAlert', 'hide',1000)
    }  
    else if(res === 'not-on-board') {
        $('#failureAlert').text(`${word} is not on the board. Try Again!`).show()

        set_timeout_hide_element('failureAlert','hide',1000)
    }   
    else {
        const points = keepScore(res, word)

        $('#scoreboard').text(counter_keepScore)

        $('#word-bank').append(' ', word, ', ')
        wordBank.push(word)

        $('#successAlert').text(`${points} POINT WORD!`).show()

        set_timeout_hide_element('successAlert', 'hide', 500)
    } 
}


function keepScore(message, word) {
    let charCount = 0
    if (message == 'ok') {
        for (let i = 0; i < word.length; i++) {
            charCount++
            counter_keepScore++
        }
    }
    return charCount
}