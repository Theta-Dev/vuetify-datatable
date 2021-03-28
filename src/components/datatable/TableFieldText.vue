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
  name: 'TableFieldText',
  components: { TableField },

  props: {
    rspan: Number,
    val: String,
  },

  methods: {
    getSearchable(val) {
      // return null;
      return val.toLowerCase();
    },
    getFilterable(val) {
      return val;
    },
  },
};
</script>

<style scoped>

</style>
