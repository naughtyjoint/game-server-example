export class Player {
  constructor(
    public role: string, 
    public status: number = 1,
    public cdCountdown: number = 10,
    public score: number = 0,
    public kill: number = 0,
    public itemList: number[] = []
  )
  {
    
  };
}