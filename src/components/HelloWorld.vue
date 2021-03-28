<template>
  <v-container>
    <DataTable />
  </v-container>
</template>

<script>
import DataTable from '@/components/datatable/DataTable.vue';

export default {
  name: 'HelloWorld',
  components: { DataTable },

  data: () => ({
  }),
};
</script>
