import { useState } from "react";

type ChatProps = {
    messages: {
        username: string,
        content: string
    }[];
    sendChatMessage: (message: string) => void;
}

function Chat({ messages, sendChatMessage }: ChatProps) {
    const [inputMessage, setInputMessage] = useState("");

    return <div className="p-6 bg-stone-900 flex-grow rounded-lg flex flex-col h-full gap-10">
        <div className="flex-grow bg-stone-800 rounded-lg overflow-hidden flex flex-col justify-end">
            {messages.map((message, i) => (
                <p key={i} className={`${i % 2 == 0 ? "bg-stone-700" : "bg-stone-800"} px-4 py-2`}>
                    <span className="text-stone-400 text-sm mr-2">{message.username}</span> {message.content}
                </p>
            ))}
        </div>
        <form className="flex gap-4"
            onSubmit={(e) => {
                e.preventDefault();

                if (inputMessage !== "") {
                    sendChatMessage(inputMessage);
                    setInputMessage("");
                }
            }}>
            <input type="text" placeholder="Type a message..."
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                className="rounded-md px-2 py-1 text-black flex-grow" />
            <button
                className="bg-slate px-3 py-2 rounded-md bg-stone-800 hover:bg-stone-700 active:bg-stone-900 transition">
                Send
            </button>
        </form>
    </div>
}

export default Chat;
