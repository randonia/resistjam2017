// Left hand window - for filtering
FIL_LIST_TITLE_Y = 25;
FIL_LIST_HEADER_PADDING = 25;
FIL_LIST_HEADER_Y = FIL_LIST_TITLE_Y + 30;
FIL_LIST_START_X = 5;
FIL_LIST_START_Y = FIL_LIST_HEADER_Y + FIL_LIST_HEADER_PADDING;
FIL_LIST_PADDING_Y = 20;
FIL_LIST_HEADER2_PADDING_Y = 25;
class FilterWindow extends BaseWindow {
  constructor() {
    super(0, 0, WIN_WIDTH / 4, WIN_HEIGHT - WIN_CMDHEIGHT, BaseWindow.TYPE_FILTER);
    this.initFilters();
  }
  initFilters() {
    this.filters = [];
    this.nodeSprites = [];
    var availableFilters = Node.getTypes();
    var idCtr = 1;
    for (var i = 0; i < availableFilters.length; i++) {
      this.filters.push({
        'set': true,
        'id': idCtr++,
        'type': availableFilters[i]
      });
    }
    // Initialize the node sprites
    for (var idxAF = 0; idxAF < availableFilters.length; idxAF++) {
      this.nodeSprites.push(new Node(0, 0, availableFilters[idxAF]));
    }
  }
  processFilterCmd(filterCmd) {
    var filterArg = filterCmd.getArg(0);
    for (var i = 0; i < this.filters.length; i++) {
      if (filterArg.toLowerCase() === 'a') {
        this.filters[i].set = true;
        continue;
      }
      if (filterArg.toLowerCase() === 'n') {
        this.filters[i].set = false;
        continue;
      }
      if (this.filters[i].id == filterArg) {
        this.filters[i].set = !this.filters[i].set;
      }
    }
    this.resetFilter();
  }
  resetFilter() {
    var state = game.state.getCurrentState();
    var mapWindow = state.getWindow(BaseWindow.TYPE_MAP);
    mapWindow.execFilter(this.filters);
  }
  render() {
    super.render();
    this.drawText(this.width * 0.5, FIL_LIST_TITLE_Y, 'MAP FILTERS', undefined, 'center');
    this.drawText(FIL_LIST_START_X, FIL_LIST_HEADER_Y, 'Filter To');
    var filters = this.filters
    var filtersLastY = 0;
    var spritePaddingX = 54;
    for (var i = 0; i < filters.length; i++) {
      var currFilter = filters[i];
      var str = sprintf("%s)[%s]......to %s", ('0000' + currFilter.id).slice(-2), (currFilter.set ? 'X' : ' '), currFilter.type);
      filtersLastY = FIL_LIST_START_Y + i * FIL_LIST_PADDING_Y;
      this.drawText(FIL_LIST_START_X, filtersLastY, str);
      this.nodeSprites[i].sprite.x = FIL_LIST_START_X + spritePaddingX;
      this.nodeSprites[i].sprite.y = FIL_LIST_START_Y + i * FIL_LIST_PADDING_Y - 13;
    }
    filtersLastY += FIL_LIST_PADDING_Y + FIL_LIST_HEADER2_PADDING_Y;
  }
}
