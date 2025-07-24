from plyer import Player
from board import Board


class Game:
    def __init__(self, player1, player2):
        self.player1 = player1
        self.player2 = player2
        self.board = Board()

    def play(self):
        current_player = self.player1
        i = 0
        while i < 9:
            self.board.display()
            place = int(input(f"Please enter place for {current_player.name} ({current_player.marker}): "))
            if self.board.make_move(place, current_player.marker):
                i += 1
                if self.board.is_winner(current_player.marker):
                    self.board.display()
                    print(f"The winner is {current_player.name}!")
                    return
                if self.board.is_draw():
                    self.board.display()
                    print("The game is a draw!")
                    return
                current_player = self.player1 if current_player == self.player2 else self.player2
            else:
                print("Invalid move, try again.")
