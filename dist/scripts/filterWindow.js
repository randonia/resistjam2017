// Left hand window - for filtering
FIL_ITEMS_STARTING_Y = 25;
FIL_LIST_HEADER_PADDING = 0;
FIL_LIST_START_X = 5;
FIL_LIST_PADDING_Y = 12;
FIL_LIST_HEADER2_PADDING_Y = 25;
class FilterWindow extends BaseWindow {
  constructor() {
    super(0, 25, WIN_WIDTH / 4, WIN_HEIGHT - WIN_CMDHEIGHT - 25, BaseWindow.TYPE_FILTER);
    this.initFilters();
    this.itemListY = FIL_ITEMS_STARTING_Y;
  }
  initFilters() {
    this.filters = [];
    this.personSprites = [];
    var idCtr = 1;
    for (var i = 0; i < gameObjects.length; i++) {
      this.filters.push({
        'tracked': false,
        'filter_id': idCtr++,
        'id': gameObjects[i].name
      });
      var personSprite = game.add.sprite(0, 0, 'nodes');
      personSprite.frame = gameObjects[i].sprite.frame;
      this.personSprites.push(personSprite);
    }
  }
  onPageUp(event) {
    this.itemListY = Utils.clamp(-(gameObjects.length - 30) * FIL_LIST_PADDING_Y, FIL_ITEMS_STARTING_Y, this.itemListY + FIL_LIST_PADDING_Y * 5);
  }
  onPageDown(event) {
    this.itemListY = Utils.clamp(-(gameObjects.length - 30) * FIL_LIST_PADDING_Y, FIL_ITEMS_STARTING_Y, this.itemListY - FIL_LIST_PADDING_Y * 5);
  }
  processFilterCmd(filterCmd) {
    var filterArg = filterCmd.getArg(0);
    for (var i = 0; i < this.filters.length; i++) {
      if (filterArg.toLowerCase() === 'a') {
        this.filters[i].tracked = true;
        continue;
      }
      if (filterArg.toLowerCase() === 'n') {
        this.filters[i].tracked = false;
        continue;
      }
      if (this.filters[i].filter_id == filterArg) {
        this.filters[i].tracked = !this.filters[i].tracked;
      }
    }
    this.resetFilter();
  }
  resetFilter() {
    mapWindow.execFilter(this.filters);
  }
  render() {
    super.render();
    var filters = this.filters
    var itemListY = this.itemListY;
    var spritePaddingX = 45;
    for (var i = 0; i < filters.length; i++) {
      var currFilter = filters[i];
      var str = sprintf("%s)[%s].....%s", ('0000' + currFilter.filter_id).slice(-2), (currFilter.tracked ? 'X' : ' '), currFilter.id);
      this.drawText(FIL_LIST_START_X, this.itemListY + i * FIL_LIST_PADDING_Y, str, 12, undefined, 'red');
      this.personSprites[i].x = FIL_LIST_START_X + spritePaddingX;
      this.personSprites[i].y = this.itemListY + (i + 1) * FIL_LIST_PADDING_Y;
    }
    // Some helpful text
    this.drawText(this.width - 40, 15, '[PgUp]', 12);
    this.drawText(this.width - 40, this.height - 10, '[PgDn]', 12);
  }
}
