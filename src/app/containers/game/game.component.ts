import { Component, OnInit } from '@angular/core';
import { Game, TileType, Crossroad, PlayerColor } from 'src/app/models/catan.models';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  private game: Game;
  constructor() {
    this.game = new Game([PlayerColor.red, PlayerColor.blue, PlayerColor.white, PlayerColor.orange], 1);
   }

  ngOnInit() {
  }

  get tiles() {
    return this.game.board.tiles;
  }

  get dices() {
    return this.game.dices;
  }

  get borders() {
    const borders = [];
    this.game.board.borders.forEach( border => {
      borders.push(border);
    });
    return borders;
  }

  get crossroads() {
    const crossroadsArray: Crossroad[] = [];
    this.game.board.crossRoads.forEach( cross => {
      crossroadsArray.push(cross);
    });
    return crossroadsArray;
  }

  get harbors() {
    return this.game.board.harbors;
  }

}
