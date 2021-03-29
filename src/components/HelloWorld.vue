<template>
  <v-container>
    <DataTable
      title="DataTable Demo"
      :fields="tableFields"
      :data="tableData"
    />
  </v-container>
</template>

<script>
import DataTable from '@/components/datatable/DataTable.vue';

import TableFieldText from '@/components/datatable/TableFieldText.vue';
import TableFieldDummy from '@/components/datatable/TableFieldDummy.vue';
import TableFieldIcon from '@/components/datatable/TableFieldIcon.vue';
import TableFieldDate from '@/components/datatable/TableFieldDate.vue';

export default {
  name: 'HelloWorld',
  components: { DataTable },

  data: () => ({
    tableFields: {
      Name: TableFieldText,
      Task: TableFieldText,
      Dummy: TableFieldDummy,
      Icon: TableFieldIcon,
      Date: TableFieldDate,
    },
    tableData: [
      [
        ['ThetaDev'],
        ['Feature: User registration', 'Documentation'],
        ['d1'],
        [0],
        ['15.02.2021', '01.03.2020'],
      ],
      [
        ['Max'],
        ['Fix: API error'],
        ['d2'],
        [1],
        ['28.07.2020', '01.03.2021'],
      ],
    ],
  }),
};
</script>
