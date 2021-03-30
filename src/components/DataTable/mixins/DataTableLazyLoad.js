export const DataTableLazyLoad = {
  data() {
    return {
      parentElement: null,
      parentElementEdge: 0,
    }
  },
  mounted() {
    this.parentElement = document.querySelector(`.${this.guid}`);
    this.parentElementEdge = this.parentElement.getBoundingClientRect().bottom;
    this.parentElementEdgeTop = this.parentElement.getBoundingClientRect().top;
  },
  updated() {
    this.parentElementEdge = this.parentElement.getBoundingClientRect().bottom;
  },
  methods: {
    eventScrollPagination() {
      let bootAnchorEdge = this.parentElement.querySelector(`.${this.guid}__boot-anchor`).getBoundingClientRect().bottom - 1500;
      let bootAnchorPreviousEdge = this.parentElement.querySelector(`.${this.guid}__boot-anchor-previous`).getBoundingClientRect().top + 10;
      if (bootAnchorPreviousEdge > this.parentElementEdgeTop) {
        // console.log('preload');
        if(this.getLinkPagePrevious()) {
          this.isBlock = false;
          this.parentElement.removeEventListener('scroll', this.eventScrollPagination);
          this.requestDataPrevious();
        }
      }
      if (bootAnchorEdge < this.parentElementEdge) {
        // console.log('load next');
        if (this.getLinkPageNext()) {
          this.isBlock = false;
          this.parentElement.removeEventListener('scroll', this.eventScrollPagination);
          this.requestData({next: true});
        }
      }
    },
  },
}