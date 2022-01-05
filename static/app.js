submit = $('#submit-guess')
let timeLeft = 12;
clickCounter = 0;

$('#start-timer').on('click', function(e) {
    e.preventDefault()
    const gameCountDown = setInterval(function(){
        if(timeLeft === 0) {
            console.log('0 time left')
            $('#timer').text('Game over')
            update_session(counter_keepScore)
            clearInterval(gameCountDown)

            $('#new-game').html('PLAY AGAIN')
            $('#successAlert').hide()
            $('#timer').hide()
            $('#start-timer').show()
            $('#guess-form').hide()
            $('#scoreboard').text(`Your final score is ${counter_keepScore}`)
            if(counter_keepScore == 0) {
                $('#scoreboard').text(`Your final score is ${counter_keepScore}`).show()
            }
        }
        
        timeLeft--
        $('#timer').text(timeLeft)
        }, 1000);

    async function start_new_game() {
        let response = await axios({
            url: 'http://127.0.0.1:5000',
            method: 'GET',
        })
        console.log(response)
        return response
    }
    if (clickCounter != 0) {
        console.log('wth')
        location.reload();
        $('.row').show()
        $('#guess-form').show()
        $('#start-timer').hide()
    }
    $('.row').show()
    $('#guess-form').show()
    $('#start-timer').hide()
    counter_keepScore = 0
    clickCounter++
});



$('#guess-form').submit(function(e) {
    e.preventDefault();
    if(timeLeft === 0 ) {
        alert('You are out of time. Try again')
    }
    checkIfValidWord();
    $('#guess-form')[0].reset();
});

async function update_session(score) {
    let response = await axios({
        url: 'http://127.0.0.1:5000/update-session',
        method: 'POST',
        data: {'score': score }
    })
    console.log(response.data['high_score'])
    responseData = response.data['high_score']
    gameCount = response.data['game_counter']
    // if (responseData >
    $('#high-score').text(`Your high score is ${responseData} and this is game #${gameCount}`).show()
    if (response.data['new_high_score'] == true) {
        alert('NEW HIGH SCORE! CONGRATS WEENS! ')
    }
}

async function checkIfValidWord() {
    if(timeLeft === 0 ) {
        return
    }
    const word = $('input').val()
    const entry = {
        guess: word
    }
    let response = await axios({
        url: 'http://127.0.0.1:5000/check-guess',
        method: 'POST',
        data: entry
    })
   
    $('#successAlert').text(response.data).show()
    keepScore(response.data, word)
}

let counter_keepScore = 0

function keepScore(message, word) {
    if (message == 'ok') {
        for (const char of word) {
            counter_keepScore++
        }
    }
    console.log(counter_keepScore)
    $('#scoreboard').text(counter_keepScore).show()
}