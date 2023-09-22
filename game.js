class Population extends ApeECS.Component {
    static properties = {
        size: 0,
        growthRate: 0
    }
}

class Resources extends ApeECS.Component {
    static properties = {
        food: 0,
        wood: 0,
        metal: 0
    }
}

class Position extends ApeECS.Component {
    static properties = {
        x: 0,
        y: 0
    }
}

class Environment extends ApeECS.Component {
    static properties = {
        wood: 0,
        woodGrowthRate: 0,
        metal: 0,
        fish: 0,
        fishGrowthRate: 0
    }
}

class Cell extends ApeECS.Component {
    static properties = {
        order: null,
        kind: null,
        pop: false,
        twinkling: false
    }
}

var cellKinds = [
    'forest',
    'farm',
    'mine',
    'beach',
    'logging',
    'town'

]

var cellColors = {
    'forest': 'darkolivegreen',
    'farm': 'springgreen',
    'mine': 'gray',
    'beach': 'bisque',
    'logging': 'sienna',
    'town': 'red'
}

class Demographics extends ApeECS.System {
    init() {
        this.mainQuery = this.createQuery().fromAll('Population', 'Resources').persist();
    }

    update(tick) {
        const entities = this.mainQuery.execute();
        for (const entity of entities) {
            const population = entity.getOne('Population');
            const resources = entity.getOne('Resources');
            var { size, growthRate } = population;
            var { food, wood, metal } = resources;
            var cellSet = entity.getComponents('Cell');
            // console.log(cellSet) //looks fine, so why is 77 not firing?
            cellSet.forEach(cell => {
                // console.log('surely this cannot fire either') //correct
                cell.pop = false;
                // console.log('reset cellpop') //not firing?
            })
            size += growthRate;
            // console.log(`population size now ${size}`)
            if (food < size) {
                food = 0;
                growthRate = -1;
                // console.log('chunk is starving!')
            } else {
                food -= size;
                growthRate = Math.ceil(size / 10);
                // console.log(`chunk is growing! +${growthRate}`) //fires every tick regardless?
            }
           
            if (size > 8) {
                console.log('plenty of labor!')
                cellSet.forEach(cell => {
                    // cell.pop = true;
                    cell.update({
                        pop: true
                    })
                })
            } else {
                // console.log('allocating labor...')
                let labor = size;
                if (food < size) {
                    cellSet.forEach(cell => {
                        if (cell.kind == 'farm') {
                            // cell.pop = true;
                            cell.update({
                                pop: true
                            })
                            labor -= 1;
                            // console.log('assigned labor to farm')
                        } else if (cell.kind == 'beach') {
                            // cell.pop = true;
                            cell.update({
                                pop: true
                            })
                            labor -= 1;
                            // console.log('assigned labor to beach')
                        }
                    })
                }
                cellSet.forEach(cell => {
                    if (cell.pop == false && labor > 0) {
                        // cell.pop = true;
                        cell.update({
                            pop: true
                        })
                        labor -= 1;
                        // console.log('assigned labor randomly')
                    }
                })
                }
            
            

            
            population.size = size;
            population.growthRate = growthRate;
            resources.food = food;
            resources.wood = wood;
            resources.metal = metal;

        }


        }
    }

class TwinkleTest extends ApeECS.System {
    init() {
        this.mainQuery = this.createQuery().fromAll('Cell').persist();
    }

    update(tick) {
        const entities = this.mainQuery.execute();
        for (const entity of entities) {
            let cellSet = entity.getComponents('Cell');
            cellSet.forEach(cell => {
                if (cell.pop == true) {
                    cell.twinkling = true;
                    console.log('cell twinkled')
                } else {
                    cell.twinkling = false;
                }   
            })
        }
    }
}



class Production extends ApeECS.System {
    init() {
        this.mainQuery = this.createQuery().fromAll('Cell').persist();
    }

    update(tick) {
        const entities = this.mainQuery.execute();
        for (const entity of entities) {
            const cellSet = entity.getComponents('Cell');
            var env = entity.getOne('Environment');
            var resources = entity.getOne('Resources');
            var { food, wood, metal } = resources;
            cellSet.forEach(cell => {
                // if (cell.kind == 'forest') {
                //     env.wood += woodGrowthRate;
                //     if (cell.pop == true) {
                //         env.wood -= 1;
                //         wood += 1;
                //         console.log('harvested 1 wood')
                //     }
                // } else if (cell.kind == 'mine') {
                //     metal += 1;
                // } else if (cell.kind == 'beach') {
                //     env.fish += fishGrowthRate;
                //     if (cell.pop == true) {
                //         env.fish -= 1;
                //         food += 1;
                //         console.log('harvested 1 fish')
                //     }

                // }
                switch (cell.kind) {
                    case 'forest':
                        env.wood += 1;
                        if (cell.pop == true) {
                            env.wood -= 1;
                            wood += 1;
                            console.log('harvested 1 wood')
                        }
                        break;
                    case 'mine':
                        if (cell.pop == true) {
                            env.metal -= 1;
                            metal += 1;
                            console.log('harvested 1 metal')
                        }
                        break;
                    case 'beach':
                        env.fish += 1;
                        if (cell.pop == true) {
                            env.fish -= 1;
                            food += 1;
                            console.log('harvested 1 fish')
                        }
                        break;
                    case 'farm':
                        if (cell.pop == true) {
                            food += 3;
                            console.log('grew 3 food on a farm')
                        }
                        break;
                    default:
                        break;
                }

            })
            resources.food = food;
            resources.wood = wood;
            resources.metal = metal;

        }
    }

}

const archiWorld = new ApeECS.World({
    trackChanges: true,
    entityPool: 100,
    cleanupPools: true,
    useApeDestroy: false
});

archiWorld.registerTags('chunk', 'boat', 'land', 'sea')
archiWorld.registerComponent(Population, 100);
archiWorld.registerComponent(Resources, 100);
archiWorld.registerComponent(Position, 100);
archiWorld.registerComponent(Environment, 100);
archiWorld.registerComponent(Cell, 900);
archiWorld.registerSystem('chunk', Demographics);
archiWorld.registerSystem('chunk', TwinkleTest);
archiWorld.registerSystem('chunk', Production);