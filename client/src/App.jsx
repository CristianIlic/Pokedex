import "./App.css";
import { useEffect, useRef, useState } from "react";

function App() {
  const [pokemon, setPokemon] = useState(null);
  const [search, setSearch] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedButton, setSelectedButton] = useState(1);
  const buttonLabels = ["INFO", "SKILLS", "MOVES", "", "", "", "", "", "", ""];

  const leftButtonRef = useRef();
  const downButtonRef = useRef();
  const rightButtonRef = useRef();
  const upButtonRef = useRef();
  const dataScreenRef = useRef();

  const fetchAPI = async () => {
    try {
      const response = await fetch(`http://localhost:1234/${search}`);
      if (!response.ok) {
        console.error("Fallo en la respuesta");
      }
      const data = await response.json();
      setPokemon(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getScreenText = () => {
    switch (selectedButton) {
      case 1:
        return (
          <>
            <div className="stats">
              <span>Alt: {pokemon.height / 10} m</span>
              <span>Peso: {pokemon.weight / 10} kg</span>
              <span>EXP: {pokemon.base_experience}</span>
            </div>
            <div className="types-list">
              {pokemon.types.map((t, i) => (
                <span key={i} className={`type-badge ${t.type.name}`}>
                  {t.type.name}
                </span>
              ))}
            </div>
          </>
        );

      case 2:
        return (
          <>
            <div className="stats">
              {pokemon.abilities.map((skill, index) => (
                <p key={index}>{skill.ability.name.toUpperCase()}</p>
              ))}
            </div>
          </>
        );

      case 3:
        return (
          <>
            <div className="moves-list">
              {pokemon.moves.map((move, index) => (
                <p key={index}>{move.move.name}</p>
              ))}
            </div>
          </>
        );
      default:
        break;
    }
  };

  const handleCry = () => {
    if (pokemon?.cries?.latest) {
      const audio = new Audio(pokemon.cries.latest);
      audio.volume = 0.1;
      audio.play();
    }
  };

  const handleButtonClick = () => {
    const audio = new Audio("/sounds/dpad-press.mp3");
    audio.volume = 0.1;
    audio.play();
  };

  useEffect(() => {
    if (!downButtonRef.current || !dataScreenRef.current) return;

    const handleScrollDown = () => {
      dataScreenRef.current.scrollTop += 20;
    };

    const handleScrollUp = () => {
      dataScreenRef.current.scrollTop -= 20;
    };

    downButtonRef.current.addEventListener("click", handleScrollDown);
    upButtonRef.current.addEventListener("click", handleScrollUp);

    return () => {
      downButtonRef.current.removeEventListener("click", handleScrollDown);
      upButtonRef.current.removeEventListener("click", handleScrollUp);
    };
  }, [pokemon]);

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
          {pokemon?.sprites?.front_default ? (
            <img src={pokemon?.sprites?.front_default} alt="" />
          ) : (
            <div className="not-found">
              <p>Pokemon no encontrado</p>
            </div>
          )}
        </div>

        <button className="cry-button" onClick={handleCry}></button>
        <div className="dpad">
          <img src="/dpad.png" alt="" />
          <button
            className="dpad-arrow left"
            ref={leftButtonRef}
            onClick={handleButtonClick}
          ></button>
          <button
            className="dpad-arrow down"
            ref={downButtonRef}
            onClick={handleButtonClick}
          ></button>
          <button
            className="dpad-arrow right"
            ref={rightButtonRef}
            onClick={handleButtonClick}
          ></button>
          <button
            className="dpad-arrow up"
            ref={upButtonRef}
            onClick={handleButtonClick}
          ></button>
        </div>
        <div className="data-screen" ref={dataScreenRef}>
          {pokemon?.name && (
            <div className="screen-content">
              <h3>{pokemon.name.toUpperCase()}</h3>
              {getScreenText()}
            </div>
          )}
        </div>

        <div className="filter-buttons">
          {buttonLabels.map((label, i) => (
            <div
              key={i}
              className="filter-button"
              onClick={() => {
                handleButtonClick();
                setSelectedButton(i + 1);
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
