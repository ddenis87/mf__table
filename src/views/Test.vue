<template>
  <div class="test">
  </div>
</template>

<script>
// import Api from '@/logics/apiHTTP';

export default {
  name: 'Test',
  async mounted() {
    // const http = new Api('http://195.2.84.28/');
    // await http.authorization('frontender_1', 'fr01Nt3n63R');
    // console.log(http);
    // console.log(http.getOptions('organization/'));
  },
};
</script>

<style lang="scss" scoped>
.test {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  height: 500px;
  .field {
    padding: 29px 0px;
    width: 210px;
    height: 80px;
    border: thin solid lightcoral;
  }
}
</style>
