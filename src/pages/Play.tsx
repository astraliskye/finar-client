import { Link, useNavigate } from "react-router-dom";
import Board from "../components/Board";
import useSocketClient from "../sockets/useSocketClient";
import { useEffect, useState } from "react";
import useTimer from "../sockets/useTimer";

function Play() {
    const navigate = useNavigate();
    const [initialJoinReceived, setInitialJoinReceived] = useState(false);
    const [player, setPlayer] = useState("");
    const [opponent, setOpponent] = useState("");
    const [turn, setTurn] = useState(-1);
    const [moves, setMoves] = useState<number[]>([]);
    const [winningMoves, setWinningMoves] = useState<number[]>([]);
    const {
        time: p1Time,
        start: startP1Timer,
        stop: stopP1Timer,
        setTime: setP1Timer
    } = useTimer(600000);
    const {
        time: p2Time,
        start: startP2Timer,
        stop: stopP2Timer,
        setTime: setP2Timer
    } = useTimer(600000);

    const [gameOver, setGameOver] = useState(false);
    const [gameOverState, setGameOverState] = useState("");
    const [winner, setWinner] = useState("");

    const handleMessage = (message: MessageEvent) => {
        const body = JSON.parse(message.data) as { type: string, data: any };

        console.log(body);

        switch (body.type) {
            case "redirect":
                if (body.data === "home") {
                    navigate("/");
                }
                break;
            case "initialJoin":
                const initialJoinData = body.data as {
                    player: string,
                    opponent: string,
                    turn: number,
                    moves: string,
                    timeControl: {
                        player1Time: number,
                        player2Time: number
                    }
                };

                if (initialJoinData.moves !== "") {
                    const newMoves = initialJoinData.moves.split(",").map(n => Number.parseInt(n));

                    for (let i = 0; i < newMoves.length; i++) {
                        moves.push(newMoves[i]);
                    }

                    setMoves([...moves]);

                    if (moves.length % 2 === 0 && newMoves.length !== 0) {
                        startP1Timer();
                        stopP2Timer();
                    } else if (moves.length % 2 === 1 && newMoves.length > 1) {
                        startP2Timer();
                        stopP1Timer();
                    }

                    setP1Timer(initialJoinData.timeControl.player1Time);
                    setP2Timer(initialJoinData.timeControl.player2Time);
                }

                setPlayer(initialJoinData.player);
                setOpponent(initialJoinData.opponent);
                setTurn(initialJoinData.turn);
                setInitialJoinReceived(true);
                break;
            case "move":
                const moveData = body.data as {
                    player: string,
                    n: number,
                    timeControl: {
                        player1Time: number,
                        player2Time: number
                    }
                };

                moves.push(moveData.n);

                if (moves.length % 2 === 0 && moves.length !== 0) {
                    startP1Timer();
                    stopP2Timer();
                } else if (moves.length % 2 === 1 && moves.length > 1) {
                    startP2Timer();
                    stopP1Timer();
                }

                setP1Timer(moveData.timeControl.player1Time);
                setP2Timer(moveData.timeControl.player2Time);

                setMoves([...moves]);
                break;
            case "gameOver":
                const gameOverData = body.data as {
                    reason: string,
                    winner: string,
                };

                setGameOver(true);
                setGameOverState(gameOverData.reason)
                setWinner(gameOverData.winner);
                break;
            default:
                break;
        }

        if (body.type === "redirect") {
            if (body.data === "home") {
                navigate("/");
            }
        }
    };

    const { connected, send } = useSocketClient("/play", handleMessage);

    if ((!connected || !initialJoinReceived) && !gameOver) {
        return <div className="w-screen h-screen flex items-center justify-center">
            <svg width="64" height="64" stroke="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><circle cx="12" cy="12" r="9.5" fill="none" strokeWidth="3" strokeLinecap="round"><animate attributeName="stroke-dasharray" dur="1.5s" calcMode="spline" values="0 150;42 150;42 150;42 150" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite" /><animate attributeName="stroke-dashoffset" dur="1.5s" calcMode="spline" values="0;-16;-59;-59" keyTimes="0;0.475;0.95;1" keySplines="0.42,0,0.58,1;0.42,0,0.58,1;0.42,0,0.58,1" repeatCount="indefinite" /></circle><animateTransform attributeName="transform" type="rotate" dur="2s" values="0 12 12;360 12 12" repeatCount="indefinite" /></g></svg>
        </div>
    } else {
        return (
            <>
                {gameOver &&
                    <div className="w-full h-64 flex flex-col items-center justify-center gap-8">
                        <div className="flex flex-col items-center">
                            <h2 className="text-2xl">Game Over</h2>
                            {(gameOverState === "abandon" || gameOverState === "finar" || gameOverState === "timeout") && <p><span className="text-primary px-1">{winner}</span> wins by <span className="text-primary px-1">{gameOverState}</span></p>}
                            {(gameOverState === "draw" || gameOverState === "abort") && <p>Game ended in a <span className="text-primary px-1">{gameOverState}</span></p>}
                        </div>
                        <div className="flex flex-col items-center">
                            <Link to="/play/online" className="underline">Play Again</Link>
                            <Link to="/" className="underline">Go to Main Menu</Link>
                        </div>
                    </div>
                }
                <div className="py-4 flex flex-col items-center gap-16">
                    <button onClick={() => { send({ type: "quit" }) }}>Quit Game</button>
                    <div className="flex flex-col gap-8 items-center">
                        <div className="flex justify-around w-64">
                            <p className={turn === moves.length % 2 ? "text-primary" : ""}>{player}</p>
                            <span>{turn === 0 ? (p1Time > 10000 ? Math.floor(p1Time / 1000) : p1Time) : (p2Time > 10000 ? Math.floor(p2Time / 1000) : p2Time)}</span>
                            vs
                            <p className={turn !== moves.length % 2 ? "text-primary" : ""}>{opponent}</p>
                            <span>{turn === 1 ? (p1Time > 10000 ? Math.floor(p1Time / 1000) : p1Time) : (p2Time > 10000 ? Math.floor(p2Time / 1000) : p2Time)}</span>
                        </div>
                        <Board moves={moves} onCellClick={(n: number) => {
                            send({
                                type: "move",
                                data: n
                            })
                        }} />
                    </div>
                </div >
            </>
        );
    }
}

export default Play;
