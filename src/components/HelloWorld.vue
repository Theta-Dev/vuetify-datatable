<template>
  <v-container>
    <DataTable
      title="DataTable Demo"
      :fields="tableFields"
      :data="tableData"
      fixed-height="220"
    />
  </v-container>
</template>

<script>
import DataTable from '@/components/datatable/DataTable.vue';
import mockData from '@/components/mock.json';
import {
  mdiAccountTie, mdiDialpad, mdiDomain, mdiLaptop, mdiMessage,
} from '@mdi/js';

import TableField from '@/components/datatable/TableField';
import TableFieldTiny from '@/components/datatable/TableFieldTiny';
import TableFieldDummy from '@/components/datatable/TableFieldDummy';
import TableFieldIcon from '@/components/datatable/TableFieldIcon';
import TableFieldDate from '@/components/datatable/TableFieldDate';
import TableFieldList from '@/components/datatable/TableFieldList';

const ICONS = {
  0: ['Domain', mdiDomain, 'green'],
  1: ['Message', mdiMessage, 'blue'],
  2: ['Dial', mdiDialpad, 'purple'],
  3: ['Computer', mdiLaptop, 'orange'],
  4: ['Account', mdiAccountTie, 'red'],
};

export default {
  name: 'HelloWorld',
  components: { DataTable },

  data: () => ({
    tableFields: [
      new TableFieldTiny('Nr.'),
      new TableField('Name'),
      new TableField('Task'),
      new TableFieldDummy('Dummy'),
      new TableFieldIcon('Icon', ICONS, true, true),
      new TableFieldDate('Date'),
      new TableFieldList('List'),
    ],

    test: new TableField('HelloWorld'),
    testin: '',
  }),

  computed: {
    tableData() {
      return mockData.map((item, i) => {
        const titem = [[i + 1]];
        titem.push(...Object.values(item));
        return titem;
      });
    },
  },
};
</script>
