const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");

const dbPath = path.join(__dirname, "cricketTeam.db");

const app = express();
module.exports = app;
app.use(express.json());

let db = null;

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
        cricket_team;
    `;
  const playersArray = await db.all(getPlayersQuery);
  response.send(
    playersArray.map((eachPlayer) => {
      return {
        playerId: eachPlayer.player_id,
        playerName: eachPlayer.player_name,
        jerseyNumber: eachPlayer.jersey_number,
        role: eachPlayer.role,
      };
    })
  );
});

//API 2
app.post("/players/", async (request, response) => {
  const requestDetails = request.body;
  const { playerName, jerseyNumber, role } = requestDetails;

  const postPlayerQuery = `
    INSERT INTO 
    cricket_team (player_name, jersey_number, role) 
    VALUES
    (
        '${playerName}',
        '${jerseyNumber}',
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
  response.send({
    playerId: player.player_id,
    playerName: player.player_name,
    jerseyNumber: player.jersey_number,
    role: player.role,
  });
});

//API 4
app.put("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const updateDetails = request.body;
  const { playerName, jerseyNumber, role } = updateDetails;

  const updateQuery = `
    UPDATE cricket_team 
    SET 
       player_name = '${playerName}',
       jersey_number = '${jerseyNumber}',
       role = '${role}'
    `;

  await db.run(updateQuery);
  response.send("Player Details Updated");
});

//API 5
app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayerQuery = `
    DELETE FROM
      cricket_team
    WHERE
      player_id = ${playerId};`;
  await db.run(deletePlayerQuery);
  response.send("Player Removed");
});
