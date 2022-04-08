const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;
const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(5000, () => {
      console.log("server running at http://localhost:5000");
    });
  } catch (e) {
    console.log(`DB error: ${e.message}`);
  }
};

initializeDBAndServer();

//API 1
app.get("/movies/", async (request, response) => {
  const getMoviesNames = `
    SELECT 
    movie_name AS movieName
    FROM 
    movie;`;
  const movieName = await db.all(getMoviesNames);
  response.send(movieName);
});

//API 2
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;
  const createMovie = `
  INSERT INTO 
  movie (director_id,movie_name,lead_actor)
  VALUES (${directorId},'${movieName}','${leadActor}');
  `;
  await db.run(createMovie);
  response.send("Movie Successfully Added");
});

//API 3
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieByIdQuery = `
    SELECT 
        movie_name AS movieName
    FROM    
         movie
    WHERE
         movie_id = ${movieId};`;
  const movie = await db.get(getMovieByIdQuery);
  response.send(movie);
});

//API 4
app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const movieDetails = request.body;
  const { directorId, movieName, leadActor } = movieDetails;

  const updateMovieDetailsQuery = `
    UPDATE
     movie
    SET 
     director_id = ${directorId},
    movie_name = '${movieName}',
    lead_actor = '${leadActor}' 
    WHERE
     movie_id = ${movieId}`;

  await db.run(updateMovieDetailsQuery);
  response.send("Movie Details Updated");
});

//API 5
app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovie = `
    DELETE FROM 
        movie
    WHERE 
    movie_id = ${movieId}`;
  await dp.run(deleteMovie);
  response.send("Movie Removed");
});

//API 6

app.get("/directors/", async (request, response) => {
  const getDirectorsName = `
    SELECT 
    director_id AS directorId,
    director_name AS directorName
    FROM 
    director;`;
  const directorName = await db.all(getDirectorsName);
  response.send(directorName);
});

//API 7
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getMoviesOnDirectorsId = `
    SELECT movie_name AS movieName
    FROM movie
    WHERE director_id = ${directorId}`;
  const movieName = await db.all(getMoviesOnDirectorsId);
  response.send(movieName);
});

module.exports = app;
