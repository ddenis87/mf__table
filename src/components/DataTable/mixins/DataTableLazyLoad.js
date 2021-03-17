export const DataTableLazyLoad = {
  data() {
    return {
      parentElement: null,
      parentElementEdge: 0,
      // isScroll: false,
    }
  },
  watch: {
    // isLoadingData() {
    //   // console.log(this.isLoadingData);
    // },
  },
  mounted() {
    this.parentElement = document.querySelector(`.${this.guid}`);
    this.parentElementEdge = this.parentElement.getBoundingClientRect().bottom;
  },
  updated() { this.parentElementEdge = this.parentElement.getBoundingClientRect().bottom;},
  methods: {
    eventScrollPagination() {
      // this.isScroll = !this.isScroll;
      let bootAnchorEdge = this.parentElement.querySelector(`.${this.guid}__boot-anchor`).getBoundingClientRect().bottom - 300;
      // console.log(bootAnchorEdge / 2, ' < ', this.parentElementEdge + 300);
      // if (bootAnchorEdge / 2 < (this.parentElementEdge + 300)) {
      //   if (this.getApiNext()) {
      //     console.log('remote listener scroll');
      //     this.parentElement.removeEventListener('scroll', this.eventScrollPagination);
      //     console.log('start lazy load');
      //     this.requestData({next: true, hidden: true});
      //   }
      // }
      // console.log(bootAnchorEdge, ' < ', this.parentElementEdge);
      if (bootAnchorEdge < this.parentElementEdge) {
        console.log('remote listener scroll');
        this.parentElement.removeEventListener('scroll', this.eventScrollPagination);
        // console.log('next');
        if (this.getApiNext())
          this.requestData({next: true});
      }
    },
  },
}