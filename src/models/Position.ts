export class Position {
    constructor(
        public cart: { 
            position: { x: number, y: number, z: number }, 
            velocity: { x: number, y: number, z: number }, 
            rotation: { x: number, y: number, z: number }
        } = 
        {
            position: {
                x: 0, 
                y: 0, 
                z: 0
            }, 
            velocity: {
                x: 0, 
                y: 0, 
                z: 0
            }, 
            rotation: {
                x: 0, 
                y: 0, 
                z: 0
            } 
        },
        public head: { 
            position: { x: number, y: number, z: number }, 
            rotation: { x: number, y: number, z: number }
        } = 
        {
            position: {
                x: 0, 
                y: 0, 
                z: 0
            }, 
            rotation: {
                x: 0, 
                y: 0, 
                z: 0
            } 
        },
        public rightHand: { 
            item: number,
            position: { x: number, y: number, z: number }, 
            rotation: { x: number, y: number, z: number }
        } = 
        {
            item: null,
            position: {
                x: 0, 
                y: 0, 
                z: 0
            }, 
            rotation: {
                x: 0, 
                y: 0, 
                z: 0
            } 
        },
        public leftHand: { 
            item: number,
            position: { x: number, y: number, z: number }, 
            rotation: { x: number, y: number, z: number }
        } = 
        {
            item: null,
            position: {
                x: 0, 
                y: 0, 
                z: 0
            }, 
            rotation: {
                x: 0, 
                y: 0, 
                z: 0
            } 
        }
    )
    {
      
    };
  }