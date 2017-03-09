// Left hand window - for filtering
FIL_ITEMS_STARTING_Y = 20;
FIL_LIST_HEADER_PADDING = 0;
FIL_LIST_START_X = 20;
FIL_LIST_PADDING_Y = 12;
FIL_LIST_HEADER2_PADDING_Y = 25;
class FilterWindow extends BaseWindow {
  constructor() {
    super(0, 25, WINDOW_FILTER_WIDTH, WIN_HEIGHT - WIN_CMDHEIGHT - 25, BaseWindow.TYPE_FILTER);
    this.initFilters();
    this.itemListY = FIL_ITEMS_STARTING_Y;
  }
  initFilters() {
    this.filters = [];
    this.personSprites = {};
    for (var i = 0; i < gameObjects.length; i++) {
      var personId = gameObjects[i].id;
      this.filters.push({
        'tracked': false,
        'id': personId,
        'name': gameObjects[i].name,
        'object': gameObjects[i]
      });
      var personSprite = game.add.sprite(0, 0, 'nodes');
      personSprite.frame = gameObjects[i].sprite.frame;
      this.personSprites[personId] = personSprite;
    }
    this.filters.sort(function(left, right) {
      return left.id.localeCompare(right.id);
    });
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
      if (this.filters[i].id == filterArg) {
        this.filters[i].tracked = !this.filters[i].tracked;
      }
    }
    this.resetFilter();
  }
  forceFilter(id, value) {
    for (var i = 0; i < this.filters.length; i++) {
      if (this.filters[i].id == id) {
        this.filters[i].tracked = value;
      }
    }
    this.resetFilter()
  }
  resetFilter() {
    mapWindow.execFilter(this.filters);
    logWindow.handleTrack(this.filters);
  }
  getGameObjectByFilterId(filterId) {
    var filter = gameObjects.filter(function(item) {
      return item.id == filterId;
    })
    return filter[0];
  }
  render() {
    super.render();
    var filters = this.filters
    var itemListY = this.itemListY;
    var spritePaddingX = 0;
    for (var i = 0; i < filters.length; i++) {
      var currFilter = filters[i];
      var str = sprintf("%s [%s]=[%s]", currFilter.name, currFilter.id, (currFilter.tracked ? 'X' : ' '));
      var color = (currFilter.tracked) ? 'rgb(220, 220, 0)' : 'green';
      this.drawText(FIL_LIST_START_X, this.itemListY + i * FIL_LIST_PADDING_Y, str, 12, undefined, color);
      this.personSprites[currFilter.id].x = spritePaddingX;
      this.personSprites[currFilter.id].y = this.itemListY + (i + 1) * FIL_LIST_PADDING_Y;
    }
    // Some helpful text
    this.drawText(this.width - 40, 15, '[PgUp]', 12);
    this.drawText(this.width - 40, this.height - 10, '[PgDn]', 12);
  }
}
