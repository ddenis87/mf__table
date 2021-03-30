<template>
  
</template>

<script>
import ElFieldString from './ElFieldString.vue';
import ElFieldNumber from './ElFieldNumber.vue';
import ElFieldDate from './ElFieldDate.vue';
import ElFieldDateTime from './ElFieldDateTime.vue';
import ElFieldChoice from './ElFieldChoice.vue';
import ElFieldDialog from './ElFieldDialog.vue';


export default {
  name: 'ElField',
  components: {
    ElFieldString,
    ElFieldNumber,
    ElFieldDate,
    ElFieldDateTime,
    ElFieldChoice,
    ElFieldDialog,
  },
}
</script>