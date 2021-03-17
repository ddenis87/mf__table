<template>
  <div class="el-field-dialog-list-box-item" @keydown.stop="eventKeydown">
    <!-- <div class="el-field-dialog-list-box-item__title">
      <v-subheader>{{ fieldLabel }}</v-subheader>
    </div> -->
    <div class="el-field-dialog-list-box-item__action">
      <el-btn class="element-start" @click="addingItem">Добавить</el-btn>
      <el-btn class="tabspace-end"
              @click="acceptList">Применить</el-btn>
    </div>
    <div class="el-field-dialog-list-box-item__body">
      <data-table-lazy :headers="tableHeaders"
                       :items="tableItems"
                       :is-clearable="true"
                       :input-properties="inputProperties"
                       @input-value="inputValue"
                       @keydown-enter="eventKeydownEnter"
                       @inserting-item="eventKeydownInsert"
                       @deleting-item="deletingItem">
      </data-table-lazy>
    </div>
    <div class="el-field-dialog-list-box-item__end">
      <el-btn class="element-end" @keydown="eventKeydownElementEnd">End</el-btn>
    </div>
    
  </div>
  
</template>

<script>
import DataTableLazy from '@/components/DataTableLazy/DataTableLazy.vue';
import ElBtn from '@/components/Elements/ElBtn/ElBtn.vue';

export default {
  name: 'ElFieldDialogListBoxItem',
  components: {
    DataTableLazy,
    ElBtn,
  },
  props: {
    countSelectValue: { type: Number, default: 0, },
    inputProperties: {
      type: Object,
      default() {
        return {}
      }
    },
  },
  data() {
    return {
      tableHeaders: [
        {key: 'value', text: 'Значение', 'position_in_template': 'grid-area: value', width: [100, ]},
      ],
      tableItems: [],
      uniqueIndex: 0,
      tableValue: [],
    }
  },
  computed: {
    fieldLabel() { return this.inputProperties.label; },
  },
  watch: {
    countSelectValue() {
      if (this.countSelectValue == 0) {
        console.log('del')
        this.tableItems.splice(0, this.tableItems.length);
        // this.uniqueIndex = 0;
        this.tableValue.splice(0, this.tableValue.length);
      }
    }
  },
  mounted() {
    this.addingItem();
  },
  methods: {
    eventKeydownElementEnd(event) {
      if (event.key == 'Tab' && event.shiftKey == false) {
        event.preventDefault();
        event.target.closest('.el-field-dialog-list-box-item').querySelector('.element-start button').focus();
      }
      console.log(event);
    },
    eventKeydown(event) {
      console.log(event);
      if (event.key == 'Insert') this.eventKeydownInsert(event);
    },
    eventKeydownInsert(event) {
      this.addingItem();
      setTimeout(() => {
        let newEventClick = new Event('click');
        event.target.closest('.el-field-dialog-list-box-item').dispatchEvent(newEventClick);
        event.target.closest('.el-field-dialog-list-box-item').querySelector('.body').lastChild.querySelector('input').focus();
      }, 100);
      // console.log(event);
      // switch(event.key) {
      //   case 'Insert': {
      //     this.addingItem();
      //     setTimeout(() => {
      //       let newEventClick = new Event('click');
      //       event.target.closest('.el-field-dialog-list-box-item').dispatchEvent(newEventClick);
      //       event.target.closest('.el-field-dialog-list-box-item').querySelector('.body').lastChild.querySelector('input').focus();
      //     }, 100);
      //     break;
      //   }
      //   case 'Tab': {
      //     if (event.target.closest('.tabspace-end')) {
      //       event.preventDefault();
      //       event.target.closest('.el-field-dialog-list-box-item').focus();
      //     }
      //     break;
      //   }
      // }
    },
    eventKeydownEnter() {
    //   this.acceptList();
    },
    addingItem() {
      // if (this.tableItems.length == 0) this.uniqueIndex = 0;
      this.uniqueIndex = this.uniqueIndex + 1;
      this.tableItems.push({uniqueIndex: this.uniqueIndex});
    },
    deletingItem(index) {
      this.tableItems.splice(index, 1);
    },
    inputValue(tableValue) {
      console.log(tableValue);
      this.tableValue = [];
      if (this.inputProperties.type == 'field') {
        for (let key of Object.keys(tableValue)) {
          if (!this.tableValue.find(item => item.id == tableValue[key].id)) this.tableValue.push(tableValue[key]);
        }
      } else if (this.inputProperties.type == 'choice') {
        for (let key of Object.keys(tableValue)) {
         if (tableValue[key])
          if (!this.tableValue.find(item => item.value == tableValue[key].value)) this.tableValue.push(tableValue[key]);
        }
      }
    },
    acceptList() {
      console.log(this.tableValue);
      this.$emit('accept-list', this.tableValue);
    },
  }
}
</script>

<style lang="scss" scoped>
@import './ElFieldDialogListBox.scss';
.el-field-dialog-list-box-item {
  display: grid;
  grid-template-areas: "el-field-dialog-list-box-item__action" "el-field-dialog-list-box-item__body" "el-field-dialog-list-box-item__end";
  grid-template-columns: 1fr;
  grid-template-rows: 56px 1fr 0px;
  padding: 8px 0px;
  padding-top: 0px;
  padding-left: 12px;
  height: calc(100vh - 64px);
  overflow: hidden;
  outline: none;
  &__title {
    grid-area: el-field-dialog-list-box-item__title;
    text-transform: uppercase;
    overflow: hidden;
  }
  &__body {
    grid-area: el-field-dialog-list-box-item__body;
    padding: 2px 2px;
    // padding-top: 14px;
    padding-right: 4px;
    // border-top: thin solid rgba(0,0,0,.12);
    // border-bottom: thin solid rgba(0,0,0,.12);
    overflow: hidden;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: $scrollWidth;
      height: $scrollHeight;
      border-radius: $scrollBorderRadius;
      &-thumb {
        border-radius: $scrollThumbBorderRadius;
        background-color: $scrollThumbBackgroundColor;
      }
    }
  }
  &__action {
    grid-area: el-field-dialog-list-box-item__action;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 56px;
    padding: 0px 12px;
    // border-top: thin solid rgba(0,0,0,.12);
    // border-bottom: thin solid rgba(0,0,0,.12);
    .btn {
      margin-left: 10px;
    }
  }
  &__end {
    grid-area: el-field-dialog-list-box-item__end;
    // visibility: hidden;
    overflow: hidden;
  }
}
</style>