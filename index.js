let context = document.querySelector('canvas').getContext('2d');

let screen = {
    color: 'midnightblue',
    x: 100,
    y: 100,
    width: 900,
    height: 900,

    draw: function() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

}


class World {
    constructor(landchunks) {
        this.world = archiWorld;
        
        // world.registerTags('chunk', 'boat', 'land', 'sea')
        // world.registerComponent(Population, 100);
        // world.registerComponent(Resources, 100);
        // world.registerComponent(Position, 100);
        // world.registerComponent(Environment, 100);
        // world.registerComponent(Cell, 900);
        // world.registerSystem('chunk', Demographics);

        for (let i = 0; i < landchunks; i++) {
            let chunk = this.world.createEntity({
                c: {
                    position: {
                        type: 'Position',
                        x: 0,
                        y: 0
                    },
                    environment: {
                        type: 'Environment',
                        wood: 0,
                        woodGrowthRate: 0,
                        metal: 0,
                        fish: 0,
                        fishGrowthRate: 0
                    },
                    population: {
                        type: 'Population',
                        size: 1,
                        growthRate: 0
                    },
                    resources: {
                        type: 'Resources',
                        food: 5,
                        wood: 0,
                        metal: 0
                    }
                }
            });
            let randomPositionX = Math.floor(Math.random() * 10);
            let randomPositionY = Math.floor(Math.random() * 10);
            
            chunk.addTag('chunk');
            chunk.addTag('land');
            // chunk.addComponent(Position, { x: randomPositionX, y: randomPositionY });
            chunk.c.position.x = randomPositionX;
            chunk.c.position.y = randomPositionY;
            // chunk.addComponent(Environment, { wood: 0, woodGrowthRate: 0, metal: 0, fish: 0, fishGrowthRate: 0 });
            // chunk.addComponent(Population, { size: 1, growthRate: 0 });
            // chunk.addComponent(Resources, { food: 5, wood: 0, metal: 0 });
            
            for (let j = 0; j < 9; j++) {
                let kind = cellKinds[Math.floor(Math.random() * cellKinds.length)];
                switch (kind) {
                    case 'forest': chunk.c.environment.wood += 5; break;
                    case 'farm': chunk.c.environment.food += 3; break;
                    case 'mine': chunk.c.environment.metal += 3; break;
                    case 'beach': chunk.c.environment.fish += 3; break;
                    // case 'sea': chunk.c.environment.fish += 5; break;
                    case 'logging': chunk.c.environment.wood += 2; break;
                    case 'town': chunk.c.pop += 2; break;
                }
                chunk.addComponent({ type: 'Cell', order: j, kind: kind, pop: false });
            }

            let startingMetal = Math.floor(Math.random() * 11);
            chunk.c.resources.metal += startingMetal;
        }
    }

    update() {
        console.log('running chunk systems...')
        this.world.runSystems('chunk');
    }
    
    render() {
        for (let chunk of this.world.getEntities('land')) {
            let chunkX = chunk.c.position.x * 3;
            let chunkY = chunk.c.position.y * 3;
            for (let cell of chunk.getComponents('Cell')) {
                let cellX = 100 + (chunkX + cell.order % 3)*30;
                let cellY = 100 + (chunkY + Math.floor(cell.order / 3))*30;
                context.fillStyle = cellColors[cell.kind];
                if (cell.twinkling) {
                    console.log('cell is twinkling!')
                    context.fillStyle = 'magenta';
                }
                context.fillRect(cellX, cellY, 30, 30);
                // console.log('drew cell')
            }

        }
    }
}

screen.draw();

let world = new World(5);
world.render();

//main game loop
let main = function() {
    world.update();
    world.render();
    setTimeout(main, 1000);
}

main();