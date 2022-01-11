{% for row in game_board %}
        {{row}} = {{game_board.index(row)}}
        {{cell}} = {{[row(i) for i in range(5)]}}
        <div class = {{cell}}>
            {{row}}
        </div>
    {% endfor %}

    show_or_hide_element{'row': 'show', 'guess-form': show, 'start-timer': 'hide'}