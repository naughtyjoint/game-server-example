import { PerformanceObserverCallback } from "perf_hooks";

export class Player {
  constructor(
    public role: string, 
    public state: number = 0,
    public score: number = 0,
    public itemList: number[] = []
  )
  {
    
  };
}