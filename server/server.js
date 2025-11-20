import express from 'express'
import cors from 'cors'

const app = express();
const corsOptions = {
  origin: ['http://localhost:5173']
}
app.use(express.json())
app.use(cors(corsOptions))

app.get('/', async (req, res) => {
  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon/')
    if (!response.ok) {
      return res.status(404).json({message: 'No se obtuvo respuesta.'})
    }
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.log(error)
    res.status(500).json({message: 'No se pudo conectar a la API'})
  } 
})

app.get('/:name', async (req, res) => {
  try {
    const { name } = req.params
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    if (!response.ok) {
      return res.status(404).json({message: 'No se obtuvo respuesta.'})
    }
    const data = await response.json()
    res.json(data)
  } catch (error) {
    console.log(error)
    res.status(500).json({message: 'No se pudo conectar a la API'})
  } 
})


const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Escuchando en http://localhost:${PORT}`)
})