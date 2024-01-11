#Archi

Simple ECS-style world simulation involving islands, their natural resources, town formation, road networks, and boats. Green and red pips indicate population, large pink dots indicate towns, and orange lines indicate roads.

- Left-click a tile with the mouse to add one population.
- Tooltips indicate current population and resource levels in highlighted tile.
-  Plus and minus on the numpad increase and decrease tick/update frequency.
- Spacebar pauses/unpauses.

![image](https://github.com/bnemeton/archi/assets/48567955/d9b77bed-27b2-4c7b-8ded-61e08b488ec1)
Population (green or red dots on a tile) convert grassland tiles to farm, cut wood from forest tiles, and mine mineral resources from mountain tiles. Green dots indicate fed population; red dots are population in excess of local food supply, and will be lost on the next update.

![roadtest_2](https://github.com/bnemeton/archi/assets/48567955/b41cb2ef-6036-4aeb-8f24-32d5722fdc2d)
Tiles with dense population eventually form towns, which extend roads into their local environment to access more resources.

![sailtest3](https://github.com/bnemeton/archi/assets/48567955/e2d93244-6dc3-4925-a0c3-1bd0235c4820)
Towns with sufficient access to wood will build ships which sail to nearby towns. Currently, ships do not bring or deposit extra resources besides crew and the food to feed them.
