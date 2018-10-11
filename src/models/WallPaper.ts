export class WallPaper {
  constructor(
    public wallPaper: { 
      id: number,
      item: number,
      state: number,
      coolDown: number,
    }[] = []
  )
  {
  };
}