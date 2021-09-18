<template>
  <div class="s-document">123</div>
</template>

<script>
import TDocument from '../components/TDocument/TDocument';

export default {
  name: 'VDocument',
  data() {
    return {
      tableDocument: new TDocument({ title: 'Свод', JSONDocument: '{"version": "1.1.1"}' }),
    };
  },
  mounted() {
    console.log(this.tableDocument);
    const sheetsList = this.tableDocument.getSheetsList();
    sheetsList[0].version = '2.2.2';
    console.log(this.tableDocument);
  },
};
</script>
