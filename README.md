# Tweeter Project

Tweeter is a simple, single-page Twitter clone.

Tweets are displayed in descending order as loaded from the server. Click the red double down arrows in the top right of the header to open a section where you may enter a new tweet up to 140 characters.  The new tweet is sent to the server and displayed below.

Placeholders for your peronal icon and name are shown in the header under the nav bar (or to the left of the tweets in larger screen sizes).

Note that there is no login feature and so personalized icons and names are not available to be shown.  The server will generate a random users information upon saving the tweet.


## Getting Started

1. Install dependencies using the `npm install` command.
2. Start the web server using the `npm run local` command. The app will be served at <http://localhost:8080/>.
3. Go to <http://localhost:8080/> in your browser.

## Dependencies

- Express
- Node 5.10.x or above
- Body-Parser
- Chance
- md5
- Timeago.js

## Screenshots

!["screenshot of starting page"](https://github.com/MikeDragert/tweeter/blob/master/docs/tweeter%201.png?raw=true)
!["screenshot of example tweet"](https://github.com/MikeDragert/tweeter/blob/master/docs/tweeter%202.png?raw=true)
!["screenshot of saved example tweet"](https://github.com/MikeDragert/tweeter/blob/master/docs/tweeter%203%20-%20tweet%20saved.png?raw=true)
!["screenshot of small screen layout"](https://github.com/MikeDragert/tweeter/blob/master/docs/tweeter%204%20-%20thin.png?raw=true)
