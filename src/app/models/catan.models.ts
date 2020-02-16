export class Tile {
  resource: TileType;
  diceNumber: number;
  coordinates: Coordinates;
  blocked: boolean;

  constructor(
    resource: TileType,
    diceNumber: number,
    coordinates: Coordinates
  ) {
    this.resource = resource;
    this.diceNumber = diceNumber;
    this.coordinates = coordinates;
  }
}

export class Coordinates {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  public equals(other: Coordinates): boolean {
    return this.hash === `${other.x}${other.y}${other.z}`;
  }

  get hash(): string {
    return `${this.x}${this.y}${this.z}`;
  }
}

export class Dices {
  dice1: number;
  dice2: number;
  get sum(): number {
    return this.dice1 + this.dice2;
  }
  throw() {
    this.dice1 = Math.floor(Math.random() * Math.floor(6)) + 1;
    this.dice2 = Math.floor(Math.random() * Math.floor(6)) + 1;
  }
}

export class Crossroad {
  // allows game instance to regocnise the unique crossroad by it's content
  hash: string;
  // allows game instance to know the location and resources linked to this crossroad
  coordinates: Coordinates[]; // len: 3
  building: Building;
  harbor: HarborType;
  constructor(coordinates: Coordinates[], harbor?: HarborType) {
    this.harbor = harbor;
    if (coordinates.length !== 3) {
      throw Error('exception: incorrect amount of coordinates');
    }
    this.coordinates = coordinates;
    this.hash = calculateHash(coordinates);
  }
}

function calculateHash(coordinates: Coordinates[]): string {
  let hash = '';
  coordinates.sort((one, two) => (one.hash > two.hash ? -1 : 1)).forEach(cor => {
    hash = hash.concat(`${cor.x}${cor.y}${cor.z} `); // hash consisting of the three concatenated coords of each of the three tiles
  });
  return hash;
}

export class Border {
  // allows game instance to know the location and resources linked to this crossroad
  hash: string;
  coordinates: Coordinates[]; // len 2
  street: Street;
  constructor(coordinates: Coordinates[]) {
    if (coordinates.length !== 2) {
      throw Error('exception: incorrect amount of coordinates');
    }
    this.coordinates = coordinates;
    this.hash = calculateHash(coordinates);
  }
}

export enum TileType {
  grain = 'grain',
  wool = 'wool',
  clay = 'clay',
  iron = 'iron',
  wood = 'wood',
  sea = 'sea',
  desert = 'desert'
}

export interface Building {
  color: PlayerColor;
  points: number;
}

export class City implements Building {
  color: PlayerColor;
  points = 2;
  constructor(color: PlayerColor) {
    this.color = color;
  }
}

export class Village implements Building {
  color: PlayerColor;
  points = 1;
  constructor(color: PlayerColor) {
    this.color = color;
  }
}

export class Street {
  color: PlayerColor;
  constructor(color: PlayerColor) {
    this.color = color;
  }
}

export enum PlayerColor {
  red = 'red',
  blue = 'blue',
  orange = 'orange',
  white = 'white'
}

export class Harbor {
  type: HarborType;
  location: Tile;
  ports: Crossroad[];
  constructor(type: HarborType, location: Tile, ports: Crossroad[]) {
    this.type = type;
    this.location = location;
    this.ports = ports;
  }
}

export enum HarborType {
  THREE_ANY_TO_ONE = 'harbor-any',
  TWO_WOOL_TO_ONE = 'harbor-wool',
  TWO_IRON_TO_ONE = 'harbor-iron',
  TWO_GRAIN_TO_ONE = 'harbor-grain',
  TWO_CLAY_TO_ONE = 'harbor-clay',
  TWO_WOOD_TO_ONE = 'harbor-wood',
}

export enum Resource {
  grain = 'grain',
  wool = 'wool',
  clay = 'clay',
  iron = 'iron',
  wood = 'wood',
}

export class Player {
  color: PlayerColor;
  resources: Resource[] = [];
  vicotryPointsTotal: number;
  victoryPointsBuildings: number;
  victoryPointsExtr: number;
  constructor(color: PlayerColor) {
    this.color = color;
  }
}

export class Board {
  tiles: Tile[];
  diceNumbers: number[];
  coordinates: Coordinates[];
  recources: TileType[];
  crossRoads: Map<string, Crossroad>;
  borders: Map<string, Border>;
  harbors: Harbor[];
  numberOfLayers: number;

  get buildings(): Building[] {
    return Array.from(this.crossRoads.values()).filter(cr => cr.building).map(cr => cr.building);
  }

  constructor(numberOfLayers: number) {
    this.numberOfLayers = numberOfLayers;
    this.coordinates = this.generateCoordinates();
    this.diceNumbers = this.generateDiceNumbers();
    this.recources = this.generateResources();
    this.tiles = this.generateTiles();
    this.generateCrossRoadsAndBorders();
    this.generateHarbors();
  }

  private generateDiceNumbers(): number[] {
    const numbers = [];
    numbers.push(2); // only added once
    for (let index = 3; index <= 11; index++) {
      if (index !== 7) {
        numbers.push(index); // added twice
        numbers.push(index);
      }
    }
    numbers.push(12); // only added once
    return numbers;
  }

  private generateCoordinates(): Coordinates[] {
    // numberofLayers = 3 for normal sized island with outer layer water
    const negative = this.numberOfLayers * -1;
    const positive = this.numberOfLayers;
    const coordinates: Coordinates[] = [];
    for (let x = negative; x <= positive; x++) {
      for (let y = negative; y <= positive; y++) {
        for (let z = negative; z <= positive; z++) {
          if (x + y + z === 0) {
            // skip any sum that isn't 0
            // sum of coordinates should always be 0
            coordinates.push(new Coordinates(x, y, z));
          }
        }
      }
    }
    return coordinates;
  }

  private generateResources(): TileType[] {
    return [
      TileType.wood,
      TileType.wood,
      TileType.wood,
      TileType.wood,
      TileType.wool,
      TileType.wool,
      TileType.wool,
      TileType.wool,
      TileType.grain,
      TileType.grain,
      TileType.grain,
      TileType.grain,
      TileType.iron,
      TileType.iron,
      TileType.iron,
      TileType.clay,
      TileType.clay,
      TileType.clay,
    ];
  }

  private generateTiles(): Tile[] {
    const tiles: Tile[] = [];
    for (const coordinates of this.coordinates) {
      if (this.isSea(coordinates)) {
        // sea tile
        tiles.push(new Tile(TileType.sea, undefined, coordinates));
      } else {
        // land tile

        // resource index
        const randomResourceIndex = Math.floor(
          Math.random() * Math.floor(this.recources.length)
        );
        // diceNumber index
        const randomDiceNumberIndex = Math.floor(
          Math.random() * Math.floor(this.diceNumbers.length)
        );
        // get resource and diceNumber using index then remove
        const resource = this.recources.splice(randomResourceIndex, 1)[0];
        const diceNumber = this.diceNumbers.splice(randomDiceNumberIndex, 1)[0];
        tiles.push(new Tile(resource, diceNumber, coordinates));
      }
    }
    // add desert tile in empty tile and swap it's coords with a random (not sea) other tile
    const landTiles = tiles.filter(tile => tile.resource !== TileType.sea);
    const randomLandTileIndex = Math.floor(
      Math.random() * Math.floor(landTiles.length)
    );
    const randomTileIndex = tiles.findIndex(tile => tile.coordinates.equals(landTiles[randomLandTileIndex].coordinates));
    const desertTileIndex = tiles.findIndex(tile => tile.resource === undefined);
    tiles[tiles.findIndex(tile => tile.resource === undefined)].resource = TileType.desert;
    const tempCoordinates = tiles[randomTileIndex].coordinates;
    tiles[randomTileIndex].coordinates = tiles[desertTileIndex].coordinates;
    tiles[desertTileIndex].coordinates = tempCoordinates;
    // Set thief on desert tile
    tiles[desertTileIndex].blocked = true;
    return tiles;
  }

  private generateCrossRoadsAndBorders(): void {
    this.borders = new Map<string, Border>();
    this.crossRoads = new Map<string, Crossroad>();
    // for each tile that is a landtile
    this.tiles.filter(tile => !this.isSea(tile.coordinates)).forEach(tile => {
      const borderingTiles = this.getAllBorderingTilesToTile(tile); // get all the bordering tiles
      // create Borders and CrossRoads
      borderingTiles.forEach(
        // for each borderTile create a new border/cr with tile(s) if none yet exists
        borderTile => {
          // create Borders
          const borderCoordinates = [tile.coordinates, borderTile.coordinates];
          const borderHashId = calculateHash(borderCoordinates);
          const oneIsLand =
            tile.resource !== TileType.sea ||
            borderTile.resource !== TileType.sea;
          const isNewBorder = !this.borders.has(borderHashId);
          if (isNewBorder && oneIsLand) {
            this.borders.set(borderHashId, new Border(borderCoordinates));
          }
          // create crossRoads
          borderingTiles
            .filter(thirdTile => thirdTile !== borderTile) // broderTile should be ommited from search for third tile
            .filter(thirdTile => this.areBorderingTiles(borderTile, thirdTile)) // should  always be 2 of them
            .forEach(thirdTile => {
              const crossRoadCoordinates = [
                tile.coordinates,
                borderTile.coordinates,
                thirdTile.coordinates
              ];
              const crossRoadHashId = calculateHash(crossRoadCoordinates);
              const isNewCrossRoad = !this.crossRoads.has(crossRoadHashId);
              if (isNewCrossRoad) {
                this.crossRoads.set(
                  crossRoadHashId,
                  new Crossroad(crossRoadCoordinates)
                );
              }
            });
        }
      );
    });
  }

  private generateHarbors(): void {
    // initiate empty harbor array
    this.harbors = [];
    // initiate of all the harbors used
    const harborsTypesSpecific = [
      HarborType.TWO_CLAY_TO_ONE,
      HarborType.TWO_GRAIN_TO_ONE,
      HarborType.TWO_IRON_TO_ONE,
      HarborType.TWO_WOOD_TO_ONE,
      HarborType.TWO_WOOL_TO_ONE,
    ];
    const harborsTypesAny = [
      HarborType.THREE_ANY_TO_ONE,
      HarborType.THREE_ANY_TO_ONE,
      HarborType.THREE_ANY_TO_ONE,
      HarborType.THREE_ANY_TO_ONE,
    ];

    // connect the harbors to the appropriate crossroads
    const harborTiles: Tile[] = [];
    const waterTiles = this.tiles.filter(tile => tile.resource === TileType.sea);
    let current = waterTiles.find(tile => tile.coordinates.hash === '0-33');
    let bordering = this.getAllBorderingTilesToTile(current).filter(tile => tile.resource === TileType.sea);
    let next = bordering[0];
    let previous: Tile;
    const end = bordering[1];
    let skip = 0;


    do {
      // find the bordering tiles to next
      bordering = this.getAllBorderingTilesToTile(next).filter(tile => tile.resource === TileType.sea);

      // find the new next (the one that's not the current)

      previous = next; // store the old next (to become the previous)
      next = bordering.find(tile => tile.coordinates.hash !== current.coordinates.hash); // find the new next

      if (skip % 2 === 0) { // check if current needs to be added

        harborTiles.push(current);
      }
      current = previous; // the current becomes the old next (previous)
      skip++; // increase skip by 1 (every other increase a harbor tile is pushed)

    } while (current.coordinates.hash !== end.coordinates.hash);

    let typeSwitch = false;
    harborTiles.forEach(harborTile => {
      let crossroadPorts = this.getAllBorderingCrossroadsToTile(harborTile);
      if (crossroadPorts.length === 3) {
        const port1 = crossroadPorts
          .find(crh => crossroadPorts
            .filter(crh2 => crh2 !== crh)
            .every(crh3 => this.areBorderingCrossroads(crh, crh3)));
        const port2 = crossroadPorts.filter(crh => crh !== port1)[(Math.random() > 0.5 ? 0 : 1)];
        crossroadPorts = [
          port1,
          port2
        ];
      }

      let pop = 0;
      let harbor: HarborType;
      crossroadPorts.forEach(crh => {
        if (pop % 2 === 0) {
          const randomHarborIndex = Math.floor(
            Math.random() * Math.floor(harborsTypesSpecific.length)
          );
          harbor = (typeSwitch) ? harborsTypesAny.pop() : harborsTypesSpecific.splice(randomHarborIndex, 1)[0];

          this.harbors.push(new Harbor(harbor, harborTile, crossroadPorts));
          typeSwitch = !typeSwitch;
        }
        crh.harbor = harbor; // set harbor for each port

        pop++;
      });
    });
  }

  private getAllBorderingBordersToCrossRoad(crossroad: Crossroad): Border[] {
    const borders: Border[] = [];
    const borderTiles = this.getAllBorderingTilesToCrossroad(crossroad); // should be 3 (1 possible undefined)
    borders.push(this.borders.get(calculateHash([borderTiles[0].coordinates, borderTiles[1].coordinates])));
    borders.push(this.borders.get(calculateHash([borderTiles[0].coordinates, borderTiles[2].coordinates])));
    borders.push(this.borders.get(calculateHash([borderTiles[1].coordinates, borderTiles[2].coordinates])));
    return borders.filter(border => border);
  }

  private getAllBorderingCrossroadsToBorder(border: Border): Crossroad[] {
    console.log(border);
    console.log(calculateHash([border.coordinates[0]]));
    return Array.from(this.crossRoads.values()).filter(cr =>
      calculateHash(cr.coordinates).includes(calculateHash([border.coordinates[0]]))
      &&
      calculateHash(cr.coordinates).includes(calculateHash([border.coordinates[1]]))
    );
  }

  private getAllBorderingTilesToTile(tile: Tile): Tile[] {
    const borderingTiles = this.tiles // find all the bordering tiles:
      .filter(otherTile => otherTile !== tile) // ... exclude the same tile ...
      .filter(otherTile => this.areBorderingTiles(tile, otherTile)); // ... and find all the bordering tiles...
    return borderingTiles;
  }

  private getAllBorderingTilesToCrossroad(crossroad: Crossroad): Tile[] {
    return this.tiles // find all the bordering tiles:
      .filter(tile => crossroad.coordinates.some(cors => cors.hash === tile.coordinates.hash)); // ... exclude the same tile ...
  }

  private getAllBorderingCrossroadsToCrossroad(crossroad: Crossroad): Crossroad[] {
    const borderingCrossroads: Crossroad[] = []; // initiate empyt value
    Array.from(this.crossRoads.values())
      .filter(cr => this.areBorderingCrossroads(cr, crossroad)) // returns bordering, ommits crossroad itself
      .forEach(cr => {
        borderingCrossroads.push(cr); // push bordering crossroad
      });
    return borderingCrossroads;
  }

  public getAllBorderingCrossroadsToTile(tile: Tile): Crossroad[] {
    return Array.from(this.crossRoads.values()) // return all the crossroads
      .filter(cr => cr.coordinates.some(cors => cors.hash === tile.coordinates.hash));
  }

  private areBorderingCrossroads(crossroad1: Crossroad, crossroad2: Crossroad) {
    const tilesBrodering1 = this.getAllBorderingTilesToCrossroad(crossroad1);
    const tilesBrodering2 = this.getAllBorderingTilesToCrossroad(crossroad2);
    return tilesBrodering1.filter(tile => tilesBrodering2.includes(tile)).length === 2;
  }

  private areBorderingTiles(tile1: Tile, tile2: Tile): boolean {
    // returns whether or not two tiles are bordering
    // differces between bordering objects are either -1,0,1 for each axis
    return (
      (tile1.coordinates.x - tile2.coordinates.x === 1 ||
        tile1.coordinates.x - tile2.coordinates.x === 0 ||
        tile1.coordinates.x - tile2.coordinates.x === -1) &&
      (tile1.coordinates.y - tile2.coordinates.y === 1 ||
        tile1.coordinates.y - tile2.coordinates.y === 0 ||
        tile1.coordinates.y - tile2.coordinates.y === -1) &&
      (tile1.coordinates.z - tile2.coordinates.z === 1 ||
        tile1.coordinates.z - tile2.coordinates.z === 0 ||
        tile1.coordinates.z - tile2.coordinates.z === -1)
    );
  }

  private isSea(coordinates: Coordinates): boolean {
    // any coordinate with a 3 or -3 is a sea tile
    return (
      coordinates.x === -3 ||
      coordinates.x === 3 ||
      (coordinates.y === -3 || coordinates.y === 3) ||
      (coordinates.z === -3 || coordinates.z === 3)
    );
  }

  public buildBuilding(building: Building, crossroad: Crossroad, initial: boolean = false): boolean {
    console.log(crossroad);
    const possible =
      // check surrounding crossroads
      this.getAllBorderingCrossroadsToCrossroad(crossroad).every(cr => cr.building === undefined)
      &&
      // check if the crossroad is empty  or if there is a village to upgrade to a city
      (crossroad.building === undefined || (crossroad.building instanceof Village && building instanceof City))
      &&
      // check if conected by street of same color
      this.getAllBorderingBordersToCrossRoad(
        crossroad).some(border => border.street && border.street.color === building.color
          || initial || building instanceof City
        );

    if (possible) {
      crossroad.building = building;
      return true;
    } // if not possible on particular crossroad:
    return false;
  }

  public buildStreet(street: Street, border: Border): boolean {
    const borderCrossroads = this.getAllBorderingCrossroadsToBorder(border);
    console.log(borderCrossroads);
    if (border.street) {
      return false;
    }
    const possible =
      (borderCrossroads.some(bcr => bcr.building && bcr.building.color === street.color)
        ||
        borderCrossroads
          .filter(bcr => !bcr.building || (bcr.building && bcr.building.color === street.color))
          .some(bcr =>
            this.getAllBorderingBordersToCrossRoad(bcr)
              .filter(nearBorder => nearBorder !== border)
              .some(bor => bor.street && bor.street.color === street.color)));
    if (possible) {
      border.street = street;
    }
    console.log(border);
    console.log(possible);
    return possible;
  }

  public findTilesWithDice(diceNumber: number): Tile[] {
    return this.tiles.filter(tile => tile.diceNumber === diceNumber);
  }

}

export enum GamePhases {
  'SETUP', // The phase wherein the players place two villages
  'PLAYING', // The phase wherein the players take turnss
  'VICTORY', // The phase where the game is won when someone's 10 points
}

export class Game {
  // The dice, which determine the resources the players get each turn
  dices: Dices;
  // The current player index
  playingAs: number;
  // An index that points to the player that is on turn
  currentPlayer: number;
  // The current GamePhase the game is in
  phase: GamePhases;
  // The list of players in the Game
  players: Player[] = [];
  // The board on which is played and where builings are built
  board: Board;
  // The prices for buildings and development
  prices: Map<string, Resource[]> = new Map<string, Resource[]>([
    ['street', [Resource.wood, Resource.clay]],
    ['village', [Resource.wood, Resource.clay, Resource.wool, Resource.grain]],
    ['city', [Resource.iron, Resource.iron, Resource.iron, Resource.grain, Resource.grain]],
    ['development', [Resource.iron, Resource.wool, Resource.grain]]
  ]);
  constructor(
    // The local player
    playingAs: number,
    // The playercolors, in same matching order as Player
    playerColors: PlayerColor[] = [PlayerColor.red, PlayerColor.blue, PlayerColor.white, PlayerColor.orange],
    // determines the gameBoard radius
    numberOfLayers: number = 3
  ) {

    this.playingAs = playingAs;

    this.board = new Board(numberOfLayers);
    playerColors.forEach(color => this.players.push(new Player(color)));
    this.players[2].resources.push(
      Resource.wood, Resource.clay,
      Resource.wood, Resource.clay,
      Resource.wood, Resource.clay,
      Resource.wood, Resource.clay,
      Resource.wood, Resource.clay,
      Resource.wood, Resource.clay,
      Resource.wood, Resource.clay,
      Resource.wood, Resource.clay,
      Resource.clay, Resource.wood,
      Resource.clay, Resource.wood,
      Resource.clay, Resource.wood,
      Resource.clay, Resource.wood,
      Resource.clay, Resource.wood,
      Resource.clay, Resource.wood,
      Resource.clay, Resource.wood,
      Resource.clay, Resource.wood,
      Resource.clay, Resource.wood,
      Resource.clay, Resource.wood,
      Resource.clay, Resource.wood,
      Resource.grain, Resource.wood,
      Resource.clay, Resource.wool,
      Resource.iron, Resource.iron,
      Resource.iron, Resource.grain,
      Resource.grain
    );
    this.board.buildBuilding(new Village(PlayerColor.red), Array.from(this.board.crossRoads.values())[0], true);
    this.board.buildBuilding(new Village(PlayerColor.orange), Array.from(this.board.crossRoads.values())[5], true);
    this.board.buildBuilding(new Village(PlayerColor.white), Array.from(this.board.crossRoads.values())[24], true);
    this.board.buildBuilding(new City(PlayerColor.blue), Array.from(this.board.crossRoads.values())[10], true);
    const val = this.board.buildStreet(new Street(PlayerColor.blue), Array.from(this.board.borders.values())[1]);

    // this.currentPlayer = Math.floor(Math.random() * this.players.length);
    this.currentPlayer = 2;

    this.dices = new Dices();
    this.throwDices();
    this.calculatePoints();
  }

  private calculatePoints() {
    const colors = this.players.map(p => p.color);
    colors.forEach(color => {
      const points = this.board.buildings
        .filter(building => building.color === color)
        .map(building => building.points)
        .reduce((previousValue: number, currentValue: number) => {
          return currentValue;
        });
      this.players.find(player => player.color === color).victoryPointsBuildings = points;
    });
  }

  endTurn(player: Player) {
    switch (this.phase) {
      case GamePhases.SETUP:
        break;
      case GamePhases.PLAYING:
        this.throwDices();
        this.currentPlayer = (this.currentPlayer + 1) % this.players.length;
        break;
      default:
        break;
    }
  }

  buildVillage(location: Crossroad) {
    if (!this.isMyTurn) {
      return;
    }
    const cost = this.prices.get('village');
    const playerCanBuy = cost.every(resource => this.myPlayer.resources.includes(resource));
    if (playerCanBuy) {
      const village = new Village(this.myPlayer.color);
      if (this.board.buildBuilding(village, location, true)) {
        for (const resource of cost) {
          this.myPlayer.resources.splice(this.myPlayer.resources.findIndex(r => r === resource), 1);
        }
      }
    }
  }

  buildCity(location: Crossroad) {
    if (!this.isMyTurn) {
      return;
    }
    const cost = this.prices.get('city');
    const temp = [...this.myPlayer.resources];
    const playerCanBuy = cost.every(
      res => {
        const index = temp.findIndex(r => r === res);
        if (index === -1) {
          return false;
        } else {
          temp.splice(index, 1);
          return true;
        }
      });
    if (playerCanBuy) {
      const city = new City(this.myPlayer.color);
      if (this.board.buildBuilding(city, location)) {
        for (const resource of cost) {
          this.myPlayer.resources.splice(this.myPlayer.resources.findIndex(r => r === resource), 1);
        }
      }
    }
  }

  buildStreet(location: Border) {
    if (!this.isMyTurn) {
      return;
    }
    const cost = this.prices.get('street');
    const playerCanBuy = cost.every(resource => this.myPlayer.resources.includes(resource));
    const street = new Street(this.myPlayer.color);
    if (playerCanBuy) {
      console.log('can buy');
      if (this.board.buildStreet(street, location)) {
        for (const resource of cost) {
          this.myPlayer.resources.splice(this.myPlayer.resources.findIndex(r => r === resource), 1);
        }
      }
    }
  }

  private throwDices() {
    this.dices.throw();
    // find the tiles that have the correct number;
    const tiles = this.board.findTilesWithDice(this.dices.sum);
    // find the bordering crossroads
    tiles.forEach(tile => {
      this.board.getAllBorderingCrossroadsToTile(tile).forEach(cr => {
        // find the bordering buildings
        // find the players per building
        if (cr.building) {
          let resource: Resource;
          switch (tile.resource) {
            case TileType.wool:
              resource = Resource.wool;
              break;
            case TileType.wood:
              resource = Resource.wood;
              break;
            case TileType.grain:
              resource = Resource.grain;
              break;
            case TileType.clay:
              resource = Resource.clay;
              break;
            case TileType.iron:
              resource = Resource.iron;
              break;
            default:
              break;
          }
          this.players.find(p => p.color === cr.building.color).resources.push(resource);
          if (cr.building.points === 2) {
            this.players.find(p => p.color === cr.building.color).resources.push(resource);
          }
        }
      });
    });
  }

  get isMyTurn(): boolean {
    return this.playingAs === this.currentPlayer;
  }

  get myPlayer(): Player {
    return this.players[this.playingAs];
  }
}
