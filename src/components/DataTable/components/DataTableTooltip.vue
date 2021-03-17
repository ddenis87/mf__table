<template>
  <div id="tooltip"
       class="tooltip" 
       :class="{'tooltip_show': isShow}" 
       :style="position" 
       @click="$emit('click')" @mousemove="$emit('mousemove')">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'DataTableTooltip',
  props: {
    isShow: {type: Boolean, default: false},
    dataProperties: {type: Object, default: () => {
      return {
        left: { type: Number, default: -300 },
        top: { type: Number, default: -300 },
        width: Number,
      }
    }},
  },
  computed: {
    position() {
      return {
        left: (this.dataProperties.left == 0) ? -20 + 'px' : this.dataProperties.left + 'px',
        top: this.dataProperties.top + 'px',
        'min-width': this.dataProperties.width + 'px',
        'max-width': (this.dataProperties.width * 1.3) + 'px',
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.tooltip {
  position: fixed;
  left: -300px;
  top: -300px;
  padding: 2px 6px;
  padding-bottom: 1px;

  font-size: .875rem;
  color: rgba(0, 0, 0, .87);

  border: thin solid rgba(0,0,0,.3);
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 1);
  
  z-index: 100;
  visibility: hidden;
  &_show {
    visibility: visible;
  }
}
</style>