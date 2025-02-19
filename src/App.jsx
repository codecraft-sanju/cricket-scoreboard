import { useState } from 'react';

function Card({ children, className }) {
  return (
    <div className={`p-4 bg-white shadow-md rounded-lg ${className}`}>
      {children}
    </div>
  );
}

function Button({ children, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 bg-blue-500 text-white rounded ${className}`}
    >
      {children}
    </button>
  );
}

export default function CricketScoreboard() {
  const [score, setScore] = useState({
    runs: 0,
    wickets: 0,
    overs: 0.0,
    balls: 0,
    sixes: 0,
    fours: 0,
    extras: 0,
  });
  const [players, setPlayers] = useState([
    {
      name: 'Player 1',
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      isBatting: true,
    },
    {
      name: 'Player 2',
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      isBatting: true,
    },
  ]);
  const [currentBatsmen, setCurrentBatsmen] = useState([0, 1]);
  const [bowlers, setBowlers] = useState([
    { name: 'Bowler 1', overs: 0, runsConceded: 0, wickets: 0 },
  ]);

  const addRun = (runs) => {
    setScore((prev) => ({
      ...prev,
      runs: prev.runs + runs,
      balls: prev.balls + 1,
      sixes: runs === 6 ? prev.sixes + 1 : prev.sixes,
      fours: runs === 4 ? prev.fours + 1 : prev.fours,
      overs: (prev.balls + 1) % 6 === 0 ? prev.overs + 0.1 : prev.overs,
    }));

    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers];
      const strikerIndex = currentBatsmen[0];
      newPlayers[strikerIndex].runs += runs;
      newPlayers[strikerIndex].balls += 1;
      if (runs === 4) newPlayers[strikerIndex].fours += 1;
      if (runs === 6) newPlayers[strikerIndex].sixes += 1;
      return newPlayers;
    });

    setBowlers((prevBowlers) => {
      const newBowlers = [...prevBowlers];
      newBowlers[0].runsConceded += runs;
      return newBowlers;
    });

    if (runs % 2 !== 0) {
      setCurrentBatsmen(([a, b]) => [b, a]);
    }
  };

  const addWicket = () => {
    setScore((prev) => ({
      ...prev,
      wickets: prev.wickets + 1,
      balls: prev.balls + 1,
    }));

    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers];
      newPlayers[currentBatsmen[0]].isBatting = false;
      return newPlayers;
    });

    setBowlers((prevBowlers) => {
      const newBowlers = [...prevBowlers];
      newBowlers[0].wickets += 1;
      return newBowlers;
    });

    setCurrentBatsmen(([_, nonStriker]) => [players.length, nonStriker]);
    setPlayers((prev) => [
      ...prev,
      {
        name: `Player ${prev.length + 1}`,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        isBatting: true,
      },
    ]);
  };

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6 text-center bg-white shadow-xl rounded-2xl">
          <h2 className="text-2xl font-bold">Total Score</h2>
          <p className="text-5xl font-extrabold text-blue-600">
            {score.runs}/{score.wickets}
          </p>
          <p className="text-xl text-gray-500">
            Overs: {score.overs.toFixed(1)}
          </p>
        </Card>
        <Card className="p-6 text-center bg-white shadow-xl rounded-2xl">
          <h2 className="text-2xl font-bold">Bowling Stats</h2>
          {bowlers.map((bowler, index) => (
            <p key={index} className="text-xl">
              {bowler.name}: {bowler.overs} Overs, {bowler.wickets} Wkts,{' '}
              {bowler.runsConceded} Runs
            </p>
          ))}
        </Card>
      </div>

      <Card className="p-6 mt-6">
        <h2 className="text-2xl font-bold">Batting Players</h2>
        <table className="w-full mt-4 border border-collapse border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 border border-gray-300">Player</th>
              <th className="px-4 py-2 border border-gray-300">Runs</th>
              <th className="px-4 py-2 border border-gray-300">Balls</th>
              <th className="px-4 py-2 border border-gray-300">SR</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, index) => (
              <tr
                key={index}
                className={player.isBatting ? 'bg-green-100' : ''}
              >
                <td className="px-4 py-2 border border-gray-300">
                  {player.name}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {player.runs}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {player.balls}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {player.balls > 0
                    ? ((player.runs / player.balls) * 100).toFixed(1)
                    : '0.0'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <div className="flex justify-center gap-2 mt-6">
        <Button onClick={() => addRun(1)}>1 Run</Button>
        <Button onClick={() => addRun(2)}>2 Runs</Button>
        <Button onClick={() => addRun(4)} className="bg-green-500">
          Four
        </Button>
        <Button onClick={() => addRun(6)} className="bg-red-500">
          Six
        </Button>
        <Button onClick={addWicket} className="text-white bg-black">
          Wicket
        </Button>
      </div>
    </div>
  );
}
