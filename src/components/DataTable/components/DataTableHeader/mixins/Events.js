export const Events = {
  data() {
    return {
      // isSorting: false,
      isSortingOrderAsc: false,
      isSortingCurrentField: '',
      isTooltipShow: false,
      isTooltipTimer: null,
      isTooltipProperties: { top: 0, left: 0, width: 0, height: 0, text: '' },
    }
  },
  computed: {
    computedTooltipShift() {
      // console.log(this.typeHeight, ' - ', this.typeColumn);
      let calcTooltipShift = { left: -2, top: -3, };
      // if (this.typeHeight == 'fixed' && this.typeColumn == 'fixed') { calcTooltipShift.left = 4; calcTooltipShift.top = -2; return calcTooltipShift};
      if (this.typeHeight == 'fixed' && this.typeColumn == 'dense') { calcTooltipShift.left = -1; calcTooltipShift.top = -3; return calcTooltipShift};
      if (this.typeHeight == 'auto' && this.typeColumn == 'fixed') { calcTooltipShift.left = 3; calcTooltipShift.top = -3; return calcTooltipShift};
      if (this.typeHeight == 'dense' && this.typeColumn == 'dense') { calcTooltipShift.left = -1; calcTooltipShift.top = -3; return calcTooltipShift};
      if (this.typeHeight == 'auto' && this.typeColumn == 'dense') { calcTooltipShift.left = -1; calcTooltipShift.top = -3; return calcTooltipShift};
      return calcTooltipShift;
    },
  },
  methods: {
    eventMouseOver(event) {
      if (event.target.classList.contains('content-display')) {
        let parent = event.target.closest('.header-column');
        this.isTooltipTimer = setTimeout(() => {
          this.isTooltipProperties = {
            top: parent.getBoundingClientRect().top + this.computedTooltipShift.top,
            left: parent.getBoundingClientRect().left + this.computedTooltipShift.left,
            width: parent.getBoundingClientRect().width,
            height: parent.getBoundingClientRect().height,
            text: parent.getAttribute('data-overflow-text'),
          };
        }, 1100);
      }
    },
    eventMouseOut(event) {
      if (event.relatedTarget?.classList?.contains('tooltip')) return;
      this.isTooltipShow = false;
      clearTimeout(this.isTooltipTimer);
    },
    eventClickColumn(event) {
      if (document.querySelector('.header-row').querySelector('.header-column__sort_active')) {
        document.querySelector('.header-row').querySelector('.header-column__sort_active').classList.remove('header-column__sort_active_asc');
        document.querySelector('.header-row').querySelector('.header-column__sort_active').classList.remove('header-column__sort_active');
      }

      let targetColumn = event.target.closest('.header-column');
      targetColumn.querySelector('.header-column__sort').classList.add('header-column__sort_active');

      if (this.isSortingOrderAsc == false) {
        this.isSortingOrderAsc = true;
        targetColumn.querySelector('.header-column__sort').classList.add('header-column__sort_active_asc');
      } else {
        this.isSortingOrderAsc = false;
        targetColumn.querySelector('.header-column__sort').classList.remove('header-column__sort_active_asc');
      }
      if (this.isSortingCurrentField != targetColumn.getAttribute('data-key')) {
        this.isSortingCurrentField = targetColumn.getAttribute('data-key');
        this.isSortingOrderAsc = true;
        targetColumn.querySelector('.header-column__sort').classList.add('header-column__sort_active_asc');
      };
      let sendOption = {
        ordering: this.isSortingOrderAsc,
        key: targetColumn.getAttribute('data-key'),
      };
      this.$emit('set-sorting', sendOption);
    },
  },
}