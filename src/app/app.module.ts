import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ResourceCardComponent } from './components/ui/resource-card/resource-card.component';
import { TileComponent } from './components/board/tile/tile.component';
import { GameComponent } from './containers/game/game.component';
import { BorderComponent } from './components/board/border/border.component';
import { CrossroadComponent } from './components/board/crossroad/crossroad.component';
import { HarborComponent } from './components/board/harbor/harbor.component';
import { BuildingComponent } from './components/board/building/building.component';
import { DicesComponent } from './components/ui/dice/dices.component';
import { PricesComponent } from './components/ui/prices/prices.component';

@NgModule({
  declarations: [
    AppComponent,
    TileComponent,
    GameComponent,
    BorderComponent,
    CrossroadComponent,
    HarborComponent,
    BuildingComponent,
    DicesComponent,
    ResourceCardComponent,
    PricesComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
