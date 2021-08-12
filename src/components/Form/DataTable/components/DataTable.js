export const DataTable = {
  computed: {
    computedActionMax() { return (this.typeRow != 'auto' && this.isExpansion == true) ? true : false; },
  },
  methods: {
    gettingValueForType(properties, value) {
      if (value == null) return '';
      switch(properties.type) {
        case 'string':
        case 'integer':
          return value;
        case 'date': {
          return value.split('-').reverse().join('.');
        }
        case 'datetime': {
          const date = value.split('T')[0].split('-').reverse().join('.');
          const time = value.split('T')[1].slice(0, 5);
          return `${date} ${time}`;
        }
        // case 'boolean':
        //   return value;
        case 'choice':
          return value['display_name'];
        case 'field': {
          // console.log(properties);
          // let newValue = this.$store.getters['DataTable/GET_RELATED_MODEL_VIEW']({tableName: properties['related_model_name']});
          let newValue = properties.relatedModelView;
          const templateValue = newValue.match(/[{\w}]/gi).join(',').replace(/,/g, '').slice(1, -1).split('}{');
          templateValue.forEach(element => {
            newValue = newValue.replace(`{${element}}`, value[element]);
          });
          return newValue;
        }
      }
    },
  }
}