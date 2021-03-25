export const Events = {
  data() {
    return {
      isSortingOrderAsc: false,
      isSortingCurrentField: '',
      isTooltipTimer: null,
    }
  },
  methods: {
    eventMouseOver(event) {
      if (event.target.classList.contains('content-display')) {
        this.isTooltipTimer = setTimeout(() => {
          let parent = event.target.closest('.header-column').getBoundingClientRect();
          this.$emit('show-tooltip', Object.assign(parent, {text: event.target.closest('.header-column').getAttribute('data-overflow-text')}));
        }, 1100);
      }
    },
    eventMouseOut(event) {
      clearTimeout(this.isTooltipTimer);
      if (event.relatedTarget?.classList?.contains('tooltip')) return;
      this.$emit('hide-tooltip');
    },
    eventClickColumn(event) {
      console.log(event);
      if (event.target.closest('.header-row').querySelector('.header-column__sort_active')) {
        event.target.closest('.header-row').querySelector('.header-column__sort_active').classList.remove('header-column__sort_active_asc');
        event.target.closest('.header-row').querySelector('.header-column__sort_active').classList.remove('header-column__sort_active');
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