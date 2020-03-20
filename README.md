
# the great sliding puzzle by Gad Zuaretz and Amit Ronen

Final Project - Advanced Programming and Web Development <br>
Gad Zuaretz 305212284 | Amit Ronen 305328189 <br>
deployed and hosted with Microsoft Azure<br>
[press here to play!](https://puzzle.amitronen.me) <br>
[backend Repo link](https://https://github.com/amit608/puzzleBackend)

## login

enter your `username`. **user name must not be empty!** <br>
once logged it, you can log out by pressing log out button.

## Play!
### choose board

in this screen you can choose between three difficulties of boards. 

### board
solve the puzzle by pressing each piece in order to move it to the free spot. <br>
Once the board is solved your records will be sent to the database for storage. <br>
**demo mode** <br>
to make life easier, we implemented a demo flag which will initiate the board almost completely solved. <br>
just add `?demo=true` to the end of the URL.

## hall of fame

here you can watch statistics and records of the game:
1. top scores for each level
2. number of games played in each level
3. average time to solve for each level
4. number of games played for each user

**current user will be marked as bold**