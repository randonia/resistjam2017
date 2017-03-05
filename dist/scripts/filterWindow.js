// Left hand window - for filtering
FIL_LIST_TITLE_Y = 25;
FIL_LIST_HEADER_PADDING = 25;
FIL_LIST_HEADER_Y = FIL_LIST_TITLE_Y + 30;
FIL_LIST_START_X = 5;
FIL_LIST_TO_START_Y = FIL_LIST_HEADER_Y + FIL_LIST_HEADER_PADDING;
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
    var toIdCtr = 0;
    var fromIdCtr = availableFilters.length;
    for (var i = 0; i < availableFilters.length; i++) {
      this.filters.push({
        'set': true,
        'id': toIdCtr++,
        'type': availableFilters[i],
        'direction': 'to'
      });
      this.filters.push({
        'set': true,
        'id': fromIdCtr++,
        'type': availableFilters[i],
        'direction': 'from'
      });
    }
    // Initialize the node sprites
    for (var idx = 0; idx < 2; idx++) {
      for (var idxAF = 0; idxAF < availableFilters.length; idxAF++) {
        this.nodeSprites.push(new Node(0, 0, availableFilters[idxAF]));
      }
    }
  }
  processFilterCmd(filterCmd) {
    var filterArg = filterCmd.getArg(0);
    for (var i = 0; i < this.filters.length; i++) {
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
  filterTo(item) {
    return item.direction == 'to';
  }
  filterFrom(item) {
    return item.direction == 'from';
  }
  render() {
    super.render();
    this.drawText(this.width * 0.5, FIL_LIST_TITLE_Y, 'MAP FILTERS', undefined, 'center');
    this.drawText(FIL_LIST_START_X, FIL_LIST_HEADER_Y, 'Filter To');
    var toFilters = this.filters.filter(this.filterTo);
    var toFiltersLastY = 0;
    var spritePaddingX = 54;
    for (var i = 0; i < toFilters.length; i++) {
      var currFilter = toFilters[i];
      var str = sprintf("%s)[%s]......to %s", ('0000' + currFilter.id).slice(-2), (currFilter.set ? 'X' : ' '), currFilter.type);
      toFiltersLastY = FIL_LIST_TO_START_Y + i * FIL_LIST_PADDING_Y;
      this.drawText(FIL_LIST_START_X, toFiltersLastY, str);
      this.nodeSprites[i].sprite.x = FIL_LIST_START_X + spritePaddingX;
      this.nodeSprites[i].sprite.y = FIL_LIST_TO_START_Y + i * FIL_LIST_PADDING_Y - 13;
    }
    toFiltersLastY += FIL_LIST_PADDING_Y + FIL_LIST_HEADER2_PADDING_Y;
    var fromFilters = this.filters.filter(this.filterFrom);
    this.drawText(FIL_LIST_START_X, toFiltersLastY, 'Filter From');
    toFiltersLastY += FIL_LIST_HEADER2_PADDING_Y;
    for (var i = 0; i < fromFilters.length; i++) {
      var currFilter = fromFilters[i];
      var str = sprintf("%s)[%s]....from %s", ('0000' + currFilter.id).slice(-2), (currFilter.set ? 'X' : ' '), currFilter.type);
      this.drawText(FIL_LIST_START_X, toFiltersLastY + i * FIL_LIST_PADDING_Y, str);
      this.nodeSprites[toFilters.length + i].sprite.x = FIL_LIST_START_X + spritePaddingX;
      this.nodeSprites[toFilters.length + i].sprite.y = toFiltersLastY + i * FIL_LIST_PADDING_Y - 13;
    }
  }
}
