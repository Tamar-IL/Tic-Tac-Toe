class Board:
    def __init__(self):
        self.board = [' ' for _ in range(9)]

    def display(self):
        print(" {} | {} | {} ".format(self.board[0], self.board[1], self.board[2]))
        print("---|---|---")
        print(" {} | {} | {} ".format(self.board[3], self.board[4], self.board[5]))
        print("---|---|---")
        print(" {} | {} | {} ".format(self.board[6], self.board[7], self.board[8]))

    def make_move(self, position, marker):
        if self.board[position] == ' ':
            self.board[position] = marker
            return True
        return False

    def is_winner(self, marker):
        win_conditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],  # Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],  # Columns
            [0, 4, 8], [2, 4, 6]              # Diagonals
        ]
        for condition in win_conditions:
            if all(self.board[i] == marker for i in condition):
                return True
        return False

    def is_draw(self):
        return all(spot != ' ' for spot in self.board)
