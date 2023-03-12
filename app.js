const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    movieName: dbObject.movie_name,
  };
};

const convertDbObjectToResponseObjects = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

const convertDbObjectToResponseObjectForDirector = (dbObject) => {
  return {
    directorId: dbObject.director_id,
    directorName: dbObject.director_name,
  };
};

//API 1

app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT
     *
    FROM
     movie
    ORDER BY
      movie_id;`;
  const movieArray = await db.all(getMoviesQuery);
  response.send(
    movieArray.map((eachMovie) => convertDbObjectToResponseObject(eachMovie))
  );
});

//API 2

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const postMovieQuery = `
  INSERT INTO
    movie (lead_actor, director_id, movie_name)
  VALUES
    ('${leadActor}', ${directorId}, '${movieName}');`;
  const movie = await database.run(postMovieQuery);
  response.send("Movie Successfully Added");
});

//API 3

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMoviesQuery = `
    SELECT
     *
    FROM
     movie
    WHERE
    movie_id = ${movieId}; `;
  const movieArray = await db.all(getMoviesQuery);
  response.send(convertDbObjectToResponseObjects(movieArray));
});

//API 4

app.put("/movies/:movieId/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;
  const updateMovieQuery = `
  UPDATE
    movie
  SET
   movie_name = '${movieName}',
    director_id = ${directorId},
    lead_actor = '${leadActor}'
  WHERE
    movie_id = ${movieId};`;

  await database.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

//API 5

app.delete("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `
  DELETE FROM
    movie
  WHERE
   movie_id = ${movieId};`;
  await database.run(deleteMovieQuery);
  response.send("Movie Removed");
});

//API 6

app.get("/directors/", async (request, response) => {
  const getDirectorQuery = `
    SELECT
     *
    FROM
     director
    ORDER BY
      director_id;`;
  const directorsArray = await db.all(getDirectorQuery);
  response.send(
    directorsArray.map((eachDirector) =>
      convertDbObjectToResponseObjectForDirector(eachDirector)
    )
  );
});

//API 7

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const getMoviesQuery = `
    SELECT
     *
    FROM movie
  NATURAL JOIN director
    WHERE
    director_id = ${directorId}; `;
  const movieArray = await db.all(getMoviesQuery);
  response.send(
    movieArray.map((eachMovie) => convertDbObjectToResponseObject(eachMovie))
  );
});

module.exports = app;
