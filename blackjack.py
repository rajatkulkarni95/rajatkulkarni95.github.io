from random import shuffle

# Defining the Deck
deck = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]*4


def deal(deck):
    hand = []
    shuffle(deck)
    for x in range(2):
        card = deck.pop()
        if card == 11:
            card = 'J'
        elif card == 12:
            card = 'Q'
        elif card == 13:
            card = 'K'
        elif card == 14:
            card = 'A'
        hand.append(card)
    return hand


def hit(hand):
    card = deck.pop()
    if card == 11:
        card = 'J'
    elif card == 12:
        card = 'Q'
    elif card == 13:
        card = 'K'
    elif card == 14:
        card = 'A'
    hand.append(card)
    return hand


def total(hand):
    total = 0
    for card in hand:
        if card == 'J' or card == 'Q' or card == 'K':
            total += 10
        elif card == 'A':
            if total >= 11:
                total += 1
            else:
                total += 11
        else:
            total += card
    return total


def playAgain():
    choice = input('Would you like to play again? (y/n)').lower()
    if choice == 'y':
        player_hand = []
        dealer_hand = []
        game()
    else:
        exit()


def blackJack(player_hand, dealer_hand):
    if total(player_hand) == 21:
        print('BlackJack! You Win!')
        playAgain()
    elif total(dealer_hand) == 21:
        print('BlackJack! HOUSE Wins!')
        playAgain()


def scores(player_hand, dealer_hand):
    if (total(player_hand) == 21):
        print('You WIN!')
    elif (total(dealer_hand) == 21):
        print('HOUSE WIN!')
    elif (total(player_hand) > 21):
        print('Busted! You Lose!')
    elif (total(dealer_hand) > 21):
        print('HOUSE Busted! You WIN!')


def game():
    choices = ''
    player_hand = deal(deck)
    dealer_hand = deal(deck)
    print(f'Dealer has {dealer_hand} for a score of {total(dealer_hand)}')
    print(f'You have {player_hand} for a score of {total(player_hand)}')
    blackJack(player_hand, dealer_hand)
    choices = input('Your move: [H]it , [S]tand, [Q]uit').lower()
    if choices == 'h':
        hit(player_hand)
        scores(player_hand, dealer_hand)
    elif choices == 's':
        while total(dealer_hand) < 17:
            hit(dealer_hand)
            print(
                f'Dealer drew a card. Their hand {dealer_hand} for a score of {total(dealer_hand)}')
        scores(player_hand, dealer_hand)
    else:
        print('Thanks for Playing!')
        playAgain()


if __name__ == '__main__':
    game()
