<template>
  <div class="test">
    <v-card class="test__card">
      <v-row>
        <v-col>
          <field-string></field-string>
        </v-col>
      </v-row>
    </v-card>
    <div class="test-head" ref="bHead">
      <div class="head-item">1</div>
      <div class="head-item">2</div>
      <div class="head-item">3</div>
      <div class="head-item">4</div>
      <div class="head-item">5</div>
      <div class="head-item">6</div>
      <div class="head-item">7</div>
      <div class="head-item">8</div>
      <div class="head-item">9</div>
      <div class="head-item">10</div>
      <div class="head-item">11</div>
      <div class="head-item">12</div>
      <div class="head-item">13</div>
      <div class="head-item">1</div>
      <div class="head-item">2</div>
      <div class="head-item">3</div>
      <div class="head-item">4</div>
      <div class="head-item">5</div>
      <div class="head-item">6</div>
      <div class="head-item">7</div>
      <div class="head-item">8</div>
      <div class="head-item">9</div>
      <div class="head-item">10</div>
      <div class="head-item">11</div>
      <div class="head-item">12</div>
      <div class="head-item">13</div>
    </div>
    <div class="test-body" ref="bBody" @scroll="evtScrollX">
      <div class="body-row">
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
      </div>
      <div class="body-row">
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
        <div class="body-item">123</div>
      </div>
    </div>
  </div>
</template>

<script>
// import FieldWrapper from '@/components/Fields/FieldWrapper.vue';
import FieldString from '@/components/Fields/FieldString.vue';

export default {
  name: 'Test',
  components: {
    // FieldWrapper,
    FieldString,
  },
  methods: {
    evtScrollX(evt) {
      console.log(evt.target.scrollLeft);
      // setTimeout(() => {
      this.$refs.bHead.scrollLeft = evt.target.scrollLeft;
      // }, 100);
    },
  },
};
</script>

<style lang="scss" scoped>
.test {
  padding: 20px;
  &__card {
    padding: 20px;
    width: 500px;
  }
  &-head {
    display: flex;
    gap: 5px;
    padding: 5px;
    margin-bottom: 10px;
    width: 100%;
    height: 100px;
    border: thin solid green;
    overflow-x: hidden;
    .head-item {
      min-width: 100px;
      border: thin solid blue;
    }
  }
  &-body {
    padding: 5px;
    width: 100%;
    height: 100px;
    border: thin solid grey;
    overflow-x: scroll;
    .body-row {
      display: flex;
      gap: 5px;
    }
    .body-item {
      min-width: 100px;
      border: thin solid blue;
    }
  }
}
</style>
