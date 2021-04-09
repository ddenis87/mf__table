<template>
  <div :class="`data-overflow ${guid}-data-overflow`" :style="styleParent">
    <div :class="`data-overflow-block ${guid}-data-overflow-block`">{{ content }}</div>
    <div :class="`data-overflow-line ${guid}-data-overflow-line`">{{ content }}</div>
  </div>
</template>

<script>
export default {
  name: 'DataTableOverflow',
  props: {
    guid: '',
    properties: { type: Object, default() { return { width: 0, height: 0, text: '' } }},
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
        width: this.properties.width - 24 + 'px',
        height: this.properties.height + 'px',
      }
    },
    content() {
      this.$emit('is-hide');
      return this.properties.text;
    },
  },
  methods: {
    computedOverflow() {
      let overflow = document.querySelector(`.${this.guid}-data-overflow`);
      let overflowBlock = document.querySelector(`.${this.guid}-data-overflow-block`);
      if (overflow.getBoundingClientRect().height + 12 < overflowBlock.getBoundingClientRect().height) {
        this.$emit('is-show');
        return;
      }
      let overflowLine = document.querySelector(`.${this.guid}-data-overflow-line`);
      if (overflow.getBoundingClientRect().width + 16 < overflowLine.getBoundingClientRect().width) {
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