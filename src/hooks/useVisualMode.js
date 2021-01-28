import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  const transition = (next, replace = false) => {
    setMode(() => next);

    setHistory((prev) => {
      return replace ? [...prev.slice(0, -1), next] : [...prev, next];
    });
  };

  const back = () => {
    if (history.length > 1) {
      setHistory((prev) => [...prev.slice(0, history.length - 1)]);
      setMode(history[history.length - 2]);
    }
  };

  return { mode, transition, back };
}
