require('dotenv').config()
const express = require('express')
const axios = require('axios')
const app = express()

const PORT = process.env.PORT || 10000

app.get('/login', (req, res) => {
  const redirectUri = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${process.env.APP_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=instagram_basic,instagram_manage_insights,pages_show_list`
  res.redirect(redirectUri)
})

app.get('/callback', async (req, res) => {
  const code = req.query.code
  try {
    const tokenRes = await axios.get('https://graph.facebook.com/v20.0/oauth/access_token', {
      params: {
        client_id: process.env.APP_ID,
        client_secret: process.env.APP_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        code
      }
    })
    const accessToken = tokenRes.data.access_token
    res.send(`Tu token de acceso es: ${accessToken}`)
  } catch (error) {
    res.status(500).send('Error al obtener el token de acceso.')
  }
})

app.get('/', (req, res) => {
  res.send('Servidor corriendo correctamente desde Render.');
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})