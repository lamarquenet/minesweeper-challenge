# Minesweeper code challenge:ge

this is a REST API in Node.js using ES6, express, mongoose, passport authentication width local and facebook strategies. 
Other technologies used on this server are Redis, session management, joi validation, cors.

## Installation

```
*clone the repository:
gh repo clone lamarquenet/minesweeper-challenge
*Fill in the config file with the credentials to your local or cloud based mongodb, redis and facebook api if you wish to
have facebook authentication. Then install dependencies:
npm install
*And finally run the local server
npm start
```

## Usage

```
This project involves the development of an express node api that do the logic and rendering of the page and handles the game, 
as well as it renders the front end for you to test and play. The front end handles only the display of the time change 
and the listening for the user actions to send the order to the server and on response it change the board so you don't
need to refresh the page each time you run an action and we take away part of the overhead of rendering the page from 
the server that would generate a refresh for each action. It can be easyly connected with a different front end program,
mobile client, or webpage as all the game logic is run in the server.
```

## Endpoints provided on the server:

```
//authenticate user using passport local strateg. 
Expect {
           email: joi.string().email().required(),
           password: joi.string().min(8).required()
       }
Endpoint:
router.post('/login', userServices.loginLocal);

// Register Handler - 
Expect {
          name: string().min(3).required(),
          password: string().min(8).required(),
          password2: string().min(8).required().valid(joi.ref('password')), //check that password2 is the same as password
          email: string().email().required()
      }
Endpoint:
router.post('/register', userServices.register);

//login with facebook
router.get('/loginFacebook',ifAuthRedirectToDash, userServices.loginFacebook);

--game handling section:
//can only access this route if the user is authenticated
Expect: nothing, if the user is authenticated it grab the game you are playing from your stored session and returns it.
router.get('/list', controllers.dashboard);

//create game and return game id
Expect:{
           height: Joi.number().integer().min(3).max(100).required(),
           width: Joi.number().integer().min(3).max(100).required(),
           mines: Joi.number().integer().min(2).max(Joi.ref('totalSquares')),
           totalSquares: Joi.number().integer()
       }
Endpoint:
router.post('/newGame',validateNewGameReqBody, controllers.newGame);

//one user select a game returns game info
Expect: Params: gameId: string().length(24).required()
Endpoint:
router.get('/:gameId',validateGameIdReqBody, controllers.getGame);

//update cell when user click a cell
Expect: {
            posY: number().integer().min(1).required(),
            posX: number().integer().min(1).required(),
            action: string().valid('reveal','question_mark', 'red_flag', "clean").required()
        }
Endpoint:
router.put('/updateCell',validateBoxUpdateParamsAndBody, controllers.updateCell);

```

## Final result

You can play the game and see the final result of this app by clicking the following link [https://buscamina.herokuapp.com/](https://buscamina.herokuapp.com/)

## Release History

* 0.0.0 Initial release (that does nothing)
* 2.0.0 Folder structure
* 3.0.0 Setting basic server with express
* 5.0.0 Ready to deploy auth server
* 6.0.0 Adding the missing start script that i forgot to deploy server to heroku
* 6.1.0 Adding missing process.env
* 6.2.0 whitelisting heroku app to avoid cors issues 
* 7.0.0 dividing code, adding security custom middleware to only let auth users sending actions to the server 
* 8.0.0 Adding validations with joi
* 9.0.0 Adding logic and models and doing config changes
* 10.0.0 adding game logic, images, style and basic front end, improving ga...
* 11.0.0 Adding logic to find adjacent cells that don't limit with a bomb
* 11.1.0 fix a bug
* 12.0.0 add timer that track time you take to finish, once you finish the timer stop and persist the time it tooks you to finish
* 12.1.0 add logic to handle the time difference between the server clock, and the client clock, add readme description
