class Rolls {
  constructor(init = true) {
    this.state = init;
  }

  setState(newState) {
    this.state = newState;
  }

  toggleState() {
    this.state = !this.state;
  }

  getState() {
    return this.state;
  }
}

// class Player {
//   constructor(players) {
//     this.players = players;
//     this.current = players[0];
//   }
// }

$(document).ready(function () {
  function render(players) {
    $('#board').html('');

    for (var i = 1; i <= 10; i++) {
      for (var j = 1; j <= 10; j++) {
        $('#board').append('<div style="left: ' + (j * 10 - 10 + 1) + '%; top: ' + (i * 10 - 10 + 1) +
          '%;"><span>' + (10 * i - 10 + j) + `</span><span class="pawn ${players['green'] === 10 * i - 10 + j ? 'player_1' : players['red'] === 10 * i - 10 + j ? 'player_2' : ''}"></span></div>`);
      }
    }
  }

  const RollsHandler = new Rolls();

  let turn = 'green';

  const players = {
    green: 0,
    red: 0,
  }

  render(players);

  function changeTurn() {
    if (turn === 'green') turn = 'red';
    else turn = 'green';
  }

  function calcNewPosition(value) {
    let newValue = players[turn] + value;

    if (value === undefined) newValue = 0;
    // if (value === 0) newValue = 0;
    if (newValue < 1) newValue = 0;
    if (newValue > 100) newValue = 0;

    players[turn] = newValue;

    if (turn === 'green' && players['green'] === players['red']) {
      players['red'] = 0;
    }

    if (turn === 'red' && players['red'] === players['green']) {
      players['green'] = 0;
    }

    if (isPrime(players[turn])) {
      players[turn] = 0;
    }

    console.log(players);
    render(players);
    updatePlayersView(players);
    changeTurn();
    resetRolls();
    RollsHandler.toggleState();

    if (newValue === 100) {
      endOfGame();
    }
  }

  document.getElementById("roll").addEventListener("click", () => {
    if (RollsHandler.getState()) {
      roll_dice();
      RollsHandler.toggleState();
    }
  });

  document.getElementById("sum").addEventListener("click", () => {
    validateRolls(getCurrentRoll, (a, b) =>
      calcNewPosition(a + b)
    );
  });

  document.getElementById("subtract").addEventListener("click", () => {
    validateRolls(getCurrentRoll, (a, b) =>
      calcNewPosition(a - b)
    );
  });

  document.getElementById("multiply").addEventListener("click", () => {
    validateRolls(getCurrentRoll, (a, b) =>
      calcNewPosition(a * b)
    );
  });

  document.getElementById("divide").addEventListener("click", () => {
    validateRolls(getCurrentRoll, (a, b) =>
      calcNewPosition(b < 1 ? undefined : Math.floor(a / b))
    );
  });

  // helpers!
  function validateRolls(getRolls, cb) {
    const [a, b] = getRolls();

    if (a !== '?' && b !== '?') {
      cb(parseInt(a), parseInt(b));
    }
  }

  function getCurrentRoll() {
    return [$("#first_die").text(), $("#second_die").text()];
  }

  function resetRolls() {
    $("#first_die").html("<span>?</span>");
    $("#second_die").html("<span>?</span>");
  }

  function updatePlayersView(players) {
    $("#start_player_1").html(`<span>${players['green']}</span>`);
    $("#start_player_2").html(`<span>${players['red']}</span>`);
  }

  function isPrime(num) {
    if (num < 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0) return false;

    for (let i = 3; i < num; i += 2) {
      if (num % i === 0) return false;
    }

    return true;
  }

  function endOfGame() {
    RollsHandler.setState(false);
    document.getElementById("msg").innerHTML = "<span>Congratulations!</span>";
    document.getElementById("msg").classList.add('winner_msg_1');
  }
});
