from flask import Flask, json, request, render_template, session, sessions
from flask import redirect, jsonify, flash, make_response
from boggle import Boggle
import time



app = (Flask(__name__))
app.config['SECRET_KEY'] = 'shhhh'

boggle_game = Boggle()

@app.route('/', methods=['GET'])
def make_game():
    '''User clicks button to begin game'''
    game_board = boggle_game.make_board()
    session['current_game'] = game_board
    return render_template('make-gameboard.html', game_board = game_board)

# @app.route('/start-game', methods=['GET'])
# def start_game():
#     '''User clicks button to begin game'''
#     # game_board = boggle_game.make_board()
#     # session['current_game'] = game_board
#     return redirect ('/')



@app.route('/check-guess', methods=['GET', 'POST'])
def check_if_word_valid():
    '''FILL THIS IN'''
    req = request.get_json()
    word = req.get('guess')
    res = boggle_game.check_valid_word(session['current_game'], word)
    return res

@app.route('/update-session', methods=['GET', 'POST'])
def update_score():
    '''FILL THIS IN'''
    req = request.get_json()
    if 'game_counter' in session:
        session['game_counter'] += 1
    if 'game_counter' not in session:
        session['game_counter'] = 1
    if 'high_score' in session:
        # print('***********************')
        # print(req['score'])
        # print(session['high_score'])
        print('***********************')
        print(session)
        if req['score'] > session['high_score']:
            session['high_score'] = req['score']
            session['new_high_score'] = True
            return session
        session['new_high_score'] = False
        return session
    else:
        session['high_score'] = 0
        session['new_high_score'] = False
        return session