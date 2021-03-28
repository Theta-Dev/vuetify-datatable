<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
      <tr>
        <td
          v-for="name in Object.keys(fields)"
          :key="name"
        >{{ name }}
        </td>
      </tr>
      </thead>
      <tbody>
      <template v-for="(item, index) in data">
        <tr
          v-for="(n, i) in numItemRows[index]"
          :key="index + '.' + i"
          v-show="visibleItems[index]"
        >
          <template
            v-for="(field, fname, fi) in fields"
          >
            <component
              v-if="(numItemRows[index] - item[fi].length) === 0 || i===0"
              :key="fname"
              :is="field"
              :rspan="(numItemRows[index] - item[fi].length) === 0 ? 1 : numItemRows[index]"
              :val="item[fi][i]"
              :filter="filter"
              :search="search"
            />
          </template>
        </tr>
      </template>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
import TableFieldText from '@/components/datatable/TableFieldText.vue';

export default {
  name: 'DataTable',
  data: () => ({
    fields: {
      Name: TableFieldText,
      Task: TableFieldText,
    },
    data: [
      [
        ['ThetaDev'],
        ['Feature: User registration', 'Documentation'],
      ],
      [
        ['Max'],
        ['Fix: API error', 'blabla', 'more blabla'],
      ],
    ],
    filter: [[], []],
    search: '',
  }),

  computed: {
    numItemRows() {
      return this.data.map((it) => it.map((fl) => fl.length).reduce((a, b) => Math.max(a, b)));
    },
    searchables() {
      return this.data.map((it) => it.map((fl, i) => fl.map(
        (flt) => {
          const field = this.fields[Object.keys(this.fields)[i]];

          if(!field.methods.getSearchable) return null;
          return field.methods.getSearchable(flt);
        },
      )));
    },
    filterables() {
      return this.data.map((it) => it.map((fl, i) => fl.map(
        (flt) => this.fields[Object.keys(this.fields)[i]].methods.getFilterable(flt),
      )));
    },
    /* filterLists() {

    }, */
    visibleItems() {
      return this.data.map((it, i) => {
        // Does search match
        if(this.search) {
          // Go through all fields of item
          // At least one searchable has to match
          const searchMatched = this.searchables[i].some(
            (fl) => fl.some((fli) => fli.includes(this.search)),
          );
          if(!searchMatched) return false;
        }

        // Does filter match
        return this.filterables[i].every(
          (fl) => fl.some((fli, ci) => {
            if(!Array.isArray(this.filter[ci]) || this.filter[ci].length === 0) return true;
            return this.filter[ci].includes(fli);
          }),
        );
      });
    },
  },

  methods: {
  },

  mounted() {
    // console.log(this.fields);
    // console.log(this.visibleItems);
  },
};
</script>

<style scoped>

</style>
