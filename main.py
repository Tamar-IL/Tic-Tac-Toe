from plyer import Player
from game import Game


def main():
    p1name = input("Enter name for Player 1: ")
    p1mark = input("Enter marker for Player 1 (X/O): ")
    p2name = input("Enter name for Player 2: ")
    p2mark = input("Enter marker for Player 2 (X/O): ")
    player1 = Player(p1name, p1mark)
    player2 = Player(p2name, p2mark)
    game = Game(player1, player2)
    game.play()


main()
