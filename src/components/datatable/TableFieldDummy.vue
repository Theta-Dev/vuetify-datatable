<template>
  <TableField
    :rspan="rspan"
  >
    I'm a dummy: {{ val }}
  </TableField>
</template>

<script>
import TableField from '@/components/datatable/TableField.vue';

export default {
  name: 'TableFieldDummy',
  components: { TableField },

  props: {
    rspan: Number,
    val: String,
  },
};
</script>
