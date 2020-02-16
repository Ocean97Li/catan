import { Component, OnInit } from '@angular/core';
import { Game, TileType, Crossroad, PlayerColor, Village, Border } from 'src/app/models/catan.models';
import { BuildingComponent } from 'src/app/components/board/building/building.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  private game: Game;
  constructor() {
    this.game = new Game(2);
  }

  ngOnInit() {
  }

  get myColor() {
    return this.game.players.map(p => p.color)[this.game.playingAs];
  }

  get myResources() {
    return this.game.players[this.game.playingAs].resources;
  }

  get tiles() {
    return this.game.board.tiles;
  }

  get dices() {
    return this.game.dices;
  }

  get prices() {
    return this.game.prices;
  }

  get borders() {
    const borders = [];
    this.game.board.borders.forEach(border => {
      borders.push(border);
    });
    return borders;
  }

  get crossroads() {
    const crossroadsArray: Crossroad[] = [];
    this.game.board.crossRoads.forEach(cross => {
      crossroadsArray.push(cross);
    });
    return crossroadsArray;
  }

  get harbors() {
    return this.game.board.harbors;
  }

  buildBuilding(location: Crossroad) {
    if (location.building instanceof Village) {
      this.game.buildCity(location);
    } else {
      this.game.buildVillage(location);
    }
  }

  buildStreet(location: Border) {
    console.log('start BUILD');
    this.game.buildStreet(location);
  }

  calculateScale(): number {
    // Fixed board scale = 700px;
    const scale = window.innerWidth / 700;
    console.log(scale);
    if (scale > 1) {
      const minSize = window.innerWidth > window.innerHeight ? window.innerHeight : window.innerWidth;
      return minSize / 700;
    }
    return scale;
  }

}
