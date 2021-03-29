<template>
  <TableField
    :rspan="rspan"
  >
    {{ val }}
  </TableField>
</template>

<script>
import TableField from '@/components/datatable/TableField.vue';

export default {
  name: 'TableFieldDate',
  components: { TableField },

  props: {
    rspan: Number,
    val: String,
  },

  methods: {
    getSearchable(val) {
      return val.toLowerCase();
    },
    getFilterable(val) {
      return val;
    },
    sortFunction(a, b) {
      function strToDate(st) {
        const pattern = /(\d{2})\.(\d{2})\.(\d{4})/;
        return new Date(st.replace(pattern, '$3-$2-$1'));
      }
      const dA = strToDate(a);
      const dB = strToDate(b);

      if(dA === dB) return 0;
      return dA > dB ? 1 : -1;
    },
  },
};
</script>
