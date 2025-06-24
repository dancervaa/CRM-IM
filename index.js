require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();

// Render requiere que uses su puerto específico
const PORT = process.env.PORT || 3000;

// Ruta raíz para comprobar que está vivo
app.get('/', (req, res) => {
  res.send('Servidor corriendo correctamente desde Render.');
});

// Ruta de login para iniciar el flujo con Facebook
app.get('/login', (req, res) => {
  const redirectUri = `https://www.facebook.com/v20.0/dialog/oauth?client_id=${process.env.APP_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=instagram_basic,instagram_manage_insights,pages_show_list`;
  res.redirect(redirectUri);
});

// Ruta de callback que recibe el "code" y devuelve el token de acceso
app.get('/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const tokenRes = await axios.get('https://graph.facebook.com/v20.0/oauth/access_token', {
      params: {
        client_id: process.env.APP_ID,
        client_secret: process.env.APP_SECRET,
        redirect_uri: process.env.REDIRECT_URI,
        code
      }
    });
    const accessToken = tokenRes.data.access_token;
    res.send(`Tu token de acceso es: ${accessToken}`);
  } catch (error) {
    console.error('Error al obtener el token:', error.response?.data || error.message);
    res.status(500).send('Error al obtener el token de acceso.');
  }
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Servidor iniciado en puerto ${PORT}`);
});
