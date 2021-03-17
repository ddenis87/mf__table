<template>
  <div :class="`data-overflow ${dId}-data-overflow`" :style="styleParent">
    <div :class="`data-overflow-block ${dId}-data-overflow-block`">{{ content }}</div>
    <div :class="`data-overflow-line ${dId}-data-overflow-line`">{{ content }}</div>
  </div>
</template>

<script>
export default {
  name: 'DataTableOverflow',
  props: {
    dId: '',
    dataProperties: Object,
  },
  data() {
    return {
      isTimer: null,
    }
  },
  computed: {
    styleParent() {
      this.$emit('is-hide');
      setTimeout(() => this.computedOverflow(), 50);
      return {
        width: this.dataProperties.width - 24 + 'px',
        height: this.dataProperties.height + 'px',
      }
    },
    content() {
      this.$emit('is-hide');
      return this.dataProperties.text;
    },
  },
  methods: {
    computedOverflow() {
      let overflow = document.querySelector(`.${this.dId}-data-overflow`);
      let overflowBlock = document.querySelector(`.${this.dId}-data-overflow-block`);
      if (overflow.getBoundingClientRect().height + 10 < overflowBlock.getBoundingClientRect().height) {
        this.$emit('is-show');
        return;
      }
      let overflowLine = document.querySelector(`.${this.dId}-data-overflow-line`);
      if (overflow.getBoundingClientRect().width + 4 < overflowLine.getBoundingClientRect().width) {
        this.$emit('is-show');
        return;
      }
      this.$emit('is-hide');
    }
  },
}
</script>

<style lang="scss" scoped>
@import '../DataTable.scss';

.data-overflow {
  position: absolute;
  left: 100px;
  top: 100px;
  border: thin solid purple;
  background-color: white;
  visibility: hidden;
  font-size: .875rem;
  font-weight: normal;
  line-height: 1.5;
  &-block {
    width: 100%;
    border: thin solid red;
    background-color: white;
  }
  &-line {
    display: inline;
    width: auto;
    border: thin solid blue;
    background-color: white;
  }
}
</style>