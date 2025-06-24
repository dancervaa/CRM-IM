require('dotenv').config()
const express = require('express')
const axios = require('axios')
const app = express()

const PORT = process.env.PORT || 10000

// Ruta para iniciar sesión con Facebook (solo con permiso "email")
app.get('/login', (req, res) => {
  const redirectUri = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${process.env.APP_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=email`
  res.redirect(redirectUri)
})

// Ruta de redirección después del login (callback)
app.get('/callback', async (req, res) => {
  const code = req.query.code

  try {
    // Intercambiar "code" por un token de acceso
    const tokenRes = await axios.get('https://graph.facebook.com/v20.0/oauth/access_token', {
      params: {
        client_id: process.env.APP_ID,
        client_secret: process.env.APP_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        code
      }
    })

    const accessToken = tokenRes.data.access_token

    // Obtener información básica del usuario
    const userRes = await axios.get('https://graph.facebook.com/me', {
      params: {
        access_token: accessToken,
        fields: 'name,email'
      }
    })

    const { name, email } = userRes.data

    res.send(`
      <h2>¡Conexión exitosa!</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
    `)

  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
    res.status(500).send('<h2>Error al obtener el token de acceso o los datos del usuario.</h2>')
  }
})

// Ruta de prueba del servidor
app.get('/', (req, res) => {
  res.send('Servidor corriendo correctamente desde Render.')
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})
