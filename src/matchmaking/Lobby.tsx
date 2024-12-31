import Chat from "./Chat";
import { useNavigate, useParams } from "react-router-dom";
import PlayerList from "./PlayerList";
import { useContext, useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import { WebSocketContext } from "../hooks/WebSocketContext";

function Lobby() {
    const { id: idString } = useParams();
    const id = parseInt(idString || "");
    const [messages, setMessages] = useState<{
        username: string,
        content: string
    }[]>([]);
    const [players, setPlayers] = useState<{
        username: string,
        lobbyOwner: boolean,
        ready: boolean
    }[]>([]);
    const [owner, setOwner] = useState("");
    const navigate = useNavigate();
    const { username } = useAuth();
    const { send, setMessageCallback, connected } = useContext(WebSocketContext);

    useEffect(() => {
        setMessageCallback((messageEvent) => {
            const message = JSON.parse(messageEvent.data) as { type: string, data: any }
            console.log(message);

            switch (message.type) {
                case "lobbyInfo":
                    const lobbyInfo = message.data as {
                        id: number,
                        owner: string,
                        players: {
                            username: string,
                            ready: boolean
                        }[]
                    }
                    setPlayers(_ => lobbyInfo.players.map(p => ({
                        ...p,
                        lobbyOwner: p.username === lobbyInfo.owner,
                    })));
                    setOwner(lobbyInfo.owner);
                    break;
                case "playerJoinedLobby":
                    const newPlayer = message.data as string;

                    setPlayers(prevPlayers => [
                        ...prevPlayers,
                        { username: newPlayer, lobbyOwner: newPlayer === owner, ready: false }
                    ]);
                    break;
                case "playerReadyStatus":
                    const readyStatus = message.data as {
                        username: string,
                        ready: boolean
                    };

                    setPlayers(prevPlayers => prevPlayers.map(player => {
                        if (player.username !== readyStatus.username) {
                            return player;
                        } else {
                            return {
                                ...player,
                                ready: readyStatus.ready
                            };
                        }
                    }))

                    break;
                case "lobbyChat":
                    const newMessage = message.data as {
                        username: string,
                        content: string
                    };

                    setMessages(prevMessages => [
                        ...prevMessages,
                        newMessage
                    ]);
                    break;
                case "matchFound":
                    const gameId = message.data as number;
                    navigate(`/game/${gameId}`)
                    break;
                case "redirect":
                    const dest = message.data as string;
                    navigate(dest);
                    break;
                default:
                    return;
            }
        });
    }, [connected]);

    useEffect(() => {
        if (connected) {
            send({
                lobbyId: id,
                type: "joinLobby",
            });
        }
    }, [connected]);

    return <div className="h-screen">
        <h1 className="text-center m-16 text-2xl">{owner}'s lobby</h1>
        <div className="flex md:flex-row gap-6 md:justify-center md:h-2/3 md:px-8 px-4 flex-col">
            <div className="md:w-3/12 flex flex-col bg-stone-900 rounded-lg p-6 h-full justify-between">
                <div className="flex flex-col justify-between gap-8 h-full">
                    <PlayerList players={players} />
                    <div className="flex flex-col gap-2">
                        <button className="w-full py-2 rounded-md bg-lime-500 text-black hover:bg-lime-400 active:bg-lime-600 transition"
                            onClick={() => send({ lobbyId: id, type: "readyPlayer" })}>
                            Ready Up
                        </button>
                        {owner === username && <button className="w-full disabled:opacity-50 disabled:hover:bg-lime-500 disabled:active:bg-lime-500 py-2 rounded-md bg-lime-500 text-black hover:bg-lime-400 active:bg-lime-600 transition"
                            disabled={!players.reduce<boolean>((acc, player) => {
                                return acc && player.ready
                            }, true)}
                            onClick={() => send({ lobbyId: id, type: "startGame" })}>
                            Start Game
                        </button>}
                    </div>
                </div>
            </div>
            <Chat messages={messages} sendChatMessage={(message: string) =>
                send({
                    lobbyId: id,
                    type: "lobbyChat",
                    data: message
                })} />
        </div>
    </div>
}

export default Lobby;
