import "./App.css";
import { useEffect, useState } from "react";

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [search, setSearch] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchAPI = async () => {
    try {
      const response = await fetch(`http://localhost:1234/${search}`);
      if (!response.ok) {
        console.log("Caca");
      }
      const data = await response.json();
      setPokemon(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCry = () => {
    if (pokemon?.cries?.latest) {
      const audio = new Audio(pokemon.cries.latest);
      audio.volume = 0.1;
      audio.play();
    }
  };

  useEffect(() => {
    fetchAPI();
  }, []);

  if (loading) return <p>Cargando...</p>;

  return (
    <>
      <input type="text" onChange={(e) => setSearch(e.target.value)} />
      <button onClick={fetchAPI}>Buscar</button>
      <div id="pokedex">
        <div id="upper-left-light" />
        <div className="upper-left-buttons">
          <div className="circle red"></div>
          <div className="circle yellow"></div>
          <div className="circle green"></div>
        </div>
        <img src="/pokedex.svg" alt="" />

        <div className="sprite-screen">
          <img src={pokemon?.sprites.front_default} alt="" />
        </div>

        <button className="cry-button" onClick={handleCry}></button>

        <div className="data-screen">
          {pokemon && (
            <div className="screen-content">
              <h3>{pokemon.name.toUpperCase()}</h3>
              <div className="stats">
                <span>Alt: {pokemon.height / 10} m</span>
                <span>Peso: {pokemon.weight / 10} kg</span>
              </div>
              <div className="types-list">
                {pokemon.types.map((t, i) => (
                  <span key={i} className={`type-badge ${t.type.name}`}>
                    {t.type.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
