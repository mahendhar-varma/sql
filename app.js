const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "cricketTeam.db");

const app = express();
module.exports = app;
app.use(express.json());

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3003, () => {
      console.log("Server running at http://localhost:3002 succesfully");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message()}`);
    process.exit(1);
  }
};

initializeDBAndServer();

//API 1
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
    SELECT
        *
    FROM  
        cricket_team ;
    `;
  const playersArray = await db.all(getPlayersQuery);
  response.send(playersArray);
});

//API 2
app.post("/players/", async (request, response) => {
  const requestDetails = request.body;
  const { player_id, player_name, jersey_number, role } = requestDetails;

  const postPlayerQuery = `
    INSERT INTO 
    cricket_team (player_name, jersey_number, role) 
    VALUES
    (
        '${player_name}',
        '${jersey_number}',
        '${role}'
    )
    `;

  const dbResponse = await db.run(postPlayerQuery);
  response.send("Player Added to Team");
});

//API 3
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayerQuery = `
    SELECT 
        * 
    FROM cricket_team 
    WHERE player_id = '${playerId}'
    `;

  const player = await db.get(getPlayerQuery);
  response.send(player);
});

//API 4
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const updateDetails = request.body;
  const { player_name, jersey_number, role } = updateDetails;

  const updateQuery = `
    UPDATE cricket_team 
    SET 
       player_name = '${player_name}',
       jersey_number = '${jersey_number}',
       role = '${role}'
    `;

  await db.run(updateQuery);
  response.send("Players Details Updated");
});

//API 5
app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;

  const deleteQuery = `
    DELETE FROM 
    cricket_team 
    WHERE player_id = '${playerId}'
    `;

  await db.run(deleteQuery);
  response.send("Player Removed");
});
