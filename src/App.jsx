import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './app.css'

const API_KEY = 'de74c2d2ab0e839cbc4ee501121a6fb0';

const App = () => {
  const [searcher, setSearcher] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showContainerFilm, setShowContainerFilm] = useState(false);
  const [showContainerFavorites, setShowContainerFavorites] = useState(false);


  const searchMovies = async () => {   
    if (searcher.trim() === '') {
      setShowContainerFilm(false);
      return
    }
      const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: API_KEY,
          query: searcher,
        },
      });
      setSearchResults(response.data.results);
      setShowContainerFilm(true); 
  }; 

  const getMovieDetails = async (movieId) => {    
      const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
        params: {
          api_key: API_KEY,
        }
      });
      setSelectedMovie(response.data)   
  };

  const handleSearch = () => {
    searchMovies()
  };

  const handleMovieClick = (movieId) => {
    getMovieDetails(movieId)
  };

  const handleAddFavorite = (movie) => {
    setFavorites([...favorites, movie])
    setShowContainerFavorites(true)
  };

  const handleRemoveFavorite = (movieId) => {
    const updatedFavorites = favorites.filter((movie) => movie.id !== movieId);
    setFavorites(updatedFavorites)
    if (updatedFavorites.length === 0) {
      setShowContainerFavorites(false)
    }
  };

  useEffect(() => {    
    console.log('Favoritos actualizados:', favorites)
    console.log('Pelicula seleccionada:', selectedMovie)
  }, [favorites, selectedMovie]);

  return (
    <>
    {/* NAVBAR */}
        <header>     
            <nav>
                <ul class="navBar">
                    <li><a href="#">Buscar</a></li>
                    <li><a href="#linkFavorites">Favoritos</a></li>
                </ul>
            </nav>
        </header>

    {/* HERO */}
      <section>
        <div className='hero'>
          <h1>SHELTER</h1>
          <div>
            <input type="text" placeholder="Buscar peliculas" value={searcher} onChange={(e) => setSearcher(e.target.value)}/>
            <button className='button' onClick={handleSearch}>Buscar</button>
          </div>
        </div>
      </section>
    {/* MOVIES */}
    {showContainerFilm && (
      <div className='containerFilm'>
          <h2 className='titleFilm'>Resultados</h2>
          <ul className='films'>
            {searchResults.map((movie) => (
              <li className='filmCard' key={movie.id} onClick={() => handleMovieClick(movie.id)}>
                <h3>{movie.title}</h3>
                {movie.poster_path ? (
                  <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
                ) : (
                  <p>No hay imagen disponible</p>
                )}
                <p>{movie.overview}</p>
                <div>                             
                  <button className='buttonFavorites' onClick={() => handleAddFavorite(movie)}>Agregar a favoritos</button>
                </div>              
              </li>              
            ))}            
          </ul>
      </div>
    )}
    {/* FAVORITES */}
    {showContainerFavorites && (
      <div className='containerFavorites' id='linkFavorites'>
        <h2>Favoritos</h2>  
        <ul className='films'>
          {favorites.map((movie) => (
            <li className='filmCard' key={movie.id}>
              <h3>{movie.title}</h3>
              {movie.poster_path ? (
                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} />
              ) : (
                <p>No hay imagen disponible</p>
              )}
              <p>{movie.overview}</p>
              <div>
                <button className='buttonFavorites' onClick={() => handleRemoveFavorite(movie.id)}>Quitar de favoritos</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )}
  </>
  );
  
};

export default App;
