import { useEffect, useState } from "react";

function useTimer(initialTime: number) {
    const [time, setTime] = useState<number>(initialTime);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let intervalId: number;

        if (isRunning) {
            if (time > 10000) {
                intervalId = setInterval(() => {
                    setTime(prevTime => prevTime - 1000);

                    if (time < 0) {
                        setTime(0);
                        setIsRunning(false);
                    }
                }, 1000);
            } else {
                intervalId = setInterval(() => {
                    setTime(prevTime => prevTime - 10);

                    if (time < 0) {
                        setTime(0);
                        setIsRunning(false);
                    }
                }, 10);
            }
        }

        return () => clearInterval(intervalId);
    }, [isRunning, time])

    const start = () => setIsRunning(true);
    const stop = () => setIsRunning(false);

    return {start, stop, setTime, isRunning, time};
}

export default useTimer;
