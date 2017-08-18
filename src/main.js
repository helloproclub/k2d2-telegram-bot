import User    from './user.js'
import Express from 'express'

const app  = new Express()
const user = new User()

app.set('port', (process.env.PORT || 5000))

app.get('/', (req, res) => {
    res.send('OK')
    user.bot.run()
  })
  .listen(app.get('port'), () => {
    console.log('Bot is running, listening on port ', app.get('port'))
  })
