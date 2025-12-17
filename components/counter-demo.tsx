"use client";

import { Button } from "@/components/ui/button";
import { counterStore } from "@/lib/stores/counter-store";
import { useStore } from "zustand";

export function CounterDemo() {
  const count = useStore(counterStore, (state) => state.count);
  const increment = useStore(counterStore, (state) => state.increment);
  const decrement = useStore(counterStore, (state) => state.decrement);
  const reset = useStore(counterStore, (state) => state.reset);

  return (
    <div className="flex flex-col gap-3">
      <div className="text-sm text-zinc-600 dark:text-zinc-400">
        count: {count}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={decrement}>-1</Button>
        <Button onClick={increment}>+1</Button>
        <Button variant="outline" onClick={reset}>
          reset
        </Button>
      </div>
    </div>
  );
}
