import { useState } from "react";


type Props = {
    closeModal: () => void;
    joinGame: (lobbyCode: string) => void;
}

export function JoinModal({ closeModal, joinGame }: Props) {
    const [lobbyCode, setLobbyCode] = useState("");

    return (
        <div
            className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-black bg-opacity-90"
            onClick={closeModal}>
            <form
                className="bg-black border-2 border-gray-700 rounded-lg flex flex-col gap-4 px-4 py-4 shadow-black items-center justify-center"
                onClick={(e) => e.stopPropagation()}
                onSubmit={(e) => {
                    e.preventDefault();
                    joinGame(lobbyCode)
                }}>
                <input
                    type="text"
                    className="border-2 border-gray-700 rounded-md px-2 py-1 bg-transparent"
                    value={lobbyCode}
                    placeholder="lobbyCode"
                    autoFocus
                    onChange={(e) => setLobbyCode(e.target.value)}
                />
                <button
                    className="px-2 py-1 rounded-md bg-primary text-black disabled:opacity-50"
                >
                    Join
                </button>
            </form>
        </div>
    );
}
