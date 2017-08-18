# K2D2 Telegram Bot
A Telegram bot application for K2D2

## Installation
- Put your bot token in `src/user/token.js`.
- Run `npm install`.
- Run `npm start`.

## Directory Structure
```
k2d2-telegram-bot
├── dist
│   └── user
├── node_modules
|   └── ...
└── src
    └── user
```

All of the bot source code is located in `src/` directory.
We are using ES6. So, the ES6 will be compiled in `dist/`.
The bot dependencies saved in `node_modules/` directory.

## TODO
- [x] Create a Telegram bot
- [x] Build a directory structure for K2D2 Telegram Bot application
- [x] Make sure that the bot would run properly
- [ ] Complete all needed commands
- [ ] Process and save all needed data
- [ ] Bind K2D2 Telegram Bot with Bitrix24 Open Channel Telegram integration
- [ ] Add unit test
