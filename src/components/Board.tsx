type BoardProps = {
    moves: number[],
    onCellClick: (n: number) => void
}

function Board({ moves, onCellClick }: BoardProps) {
    return <div className="flex flex-col gap-1">
        {[...new Array(10)].map((_, i) => <div key={i} className="flex gap-1">
            {[...new Array(10)].map((_, j) => <div key={j} className={`w-8 h-8 bg-stone-800 gap-1 flex items-center justify-center font-bold font-mono select-none`}
                onClick={() => onCellClick(j + i * 10)}>
                {moves.indexOf(j + i * 10) != -1 && (
                    moves.indexOf(j + i * 10) % 2 === 0
                        ? "X"
                        : "O"
                )}
            </div>)}
        </div>)}
    </div>;
}

export default Board;
