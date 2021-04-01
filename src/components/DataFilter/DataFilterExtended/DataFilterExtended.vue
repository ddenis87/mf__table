<template>
  <div class="data-filter-extended" @keydown.stop="eventKeydown">
    <div class="data-filter-extended__body">
      <data-filter-extended-item v-for="item in filterList"
                                 :table-name="tableName"
                                 :guid="guid"
                                 :key="item.key"
                                 :input-properties="item"
                                 @input-filter="inputFilter"
                                 @keydown.stop="eventKeydown"
                                 @next-element="nextElement"></data-filter-extended-item>
    </div>
    <div class="data-filter-extended__action">
      <!-- <el-btn @click="resetFilter">Очистить</el-btn> -->
      <el-btn class="tabspace-end" @click="acceptFilter" @keydown.stop="eventKeydownAcceptFilter">Применить</el-btn>
    </div>
  </div>
</template>

<script>
import DataFilterExtendedItem from './DataFilterExtendedItem.vue';
import ElBtn from '@/components/Elements/ElBtn/ElBtn.vue';
export default {
  name: 'DataFilterExtended',
  components: {
    DataFilterExtendedItem,
    ElBtn,
  },
  props: {
    tableName: { type: String, default: null, },
    guid: { type: String, default: null },
    isOpen: { type: Boolean, default: false, },
    listException: { type: Array, default() { return ['id', 'is_deleted', 'is_group', 'parent','related'] } },
  },
  data() {
    return {
      valueFilterObject: {},
    }
  },
  computed: {
    // tableNameDescription() { return (!this.tableName) ? '' : this.$store.getters[`DataTable/GET_DESCRIPTION`](this.tableName); },
    filterList() {
      let filterListArray = [];
      let filterList = this.$store.getters[`DataTable/GET_LIST_OPTIONS`]({tableName: this.tableName});
      for (let key of Object.keys(filterList))
        if (!this.listException.includes(key))
          filterListArray.push(Object.assign({key: key}, filterList[key]));
      // console.log(filterListArray);
      return filterListArray;
    },
  },
  watch: {
    isOpen() {
      if (this.isOpen == true) {
        // console.log(document.activeElement);
        // console.log(document.querySelector('.data-filter-extended .data-filter-extended__body').firstChild.querySelector('.item-compare input'));
        setTimeout(() => {
          document.querySelector('.data-filter-extended .data-filter-extended__body').firstChild.querySelector('.item-compare input').focus();
        }, 100);
      }
    },
  },
  methods: {
    nextElement(target) {
      // console.log(target.nextElementSibling.querySelector('.item-data .el-field__item input'));
      // console.log(target.nextElementSibling);
      if (target.nextElementSibling == null) {
        target.closest('.data-filter-extended').querySelector('.tabspace-end button').focus();
        return;
      }
      // console.log(target.nextElementSibling);
      target.nextElementSibling.querySelector('.item .item-compare .el-field__item input').focus();
      // target.nextElementSibling.focus();
    },
    eventKeydownAcceptFilter(event) {
      if (event.key == 'Tab' && event.shiftKey == false) {
        event.preventDefault();
        // console.log(event);
        let startElement = event.target.closest('.data-filter-extended').querySelector('.data-filter-extended__body').firstChild.querySelector('.item-compare input');
        startElement.focus();
      }
      
    },
    eventKeydown() {
      // if (event.key == 'Enter') this.nextElement(event.target);
      // console.log(event);
      // console.log(document.activeElement);
    },
    inputFilter(option) {
      if (option.key == 'is_deleted') { return; }
      if (option.value == null) {
        // console.log('delete');
        if (option.key in this.valueFilterObject) delete this.valueFilterObject[option.key];

        return;
      }
      this.valueFilterObject[option.key] = option.value;
      // console.log(this.valueFilterObject);
    },
    acceptFilter() {
      let filterString = '';
      for(let value of Object.values(this.valueFilterObject)) {
        filterString += value;
      }
      let sendOption = {
        tableName: this.tableName,
        guid: this.guid,
        value: filterString,
      };
      this.$store.dispatch('DataTable/SET_FILTER_EXTENDED', sendOption);
      this.$emit('accept');
    },
    resetFilter() {
      let sendOption = {
        tableName: this.tableName,
        guid: this.guid,
        value: null,
      };
      this.$store.dispatch('DataTable/SET_FILTER_EXTENDED', sendOption);
    },
  }
}
</script>

<style lang="scss" scoped>
@import './DataFilterExtended.scss';
.data-filter-extended {
  display: grid;
  grid-template-areas: "data-filter-extended__body" "data-filter-extended__action";
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 48px;
  padding: 8px 0px;
  padding-left: 10px;
  height: calc(100vh - 64px);
  overflow: hidden;
  background-color: white;
  &__body {
    grid-area: data-filter-extended__body;
    padding: 0px 8px;
    padding-top: 10px;
    padding-right: 10px;
    border-bottom: thin solid rgba(0,0,0,.12);  
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
    grid-area: data-filter-extended__action;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    height: 56px;
    padding: 0px 16px;
  }
}
</style>