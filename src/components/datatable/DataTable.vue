<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
      <tr>
        <th
          v-for="name in Object.keys(fields)"
          :key="name"
        >{{ name }}
        </th>
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
        ['Fix: API error'],
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
      return this.data.map((it) => it.map((fl, i) => fl.reduce(
        (result, flt) => {
          const field = this.fields[Object.keys(this.fields)[i]];

          if(!field.methods.getSearchable) return result;
          const res = field.methods.getSearchable(flt);
          if(res) result.push(res);
          return result;
        }, [],
      )));
    },
    filterables() {
      return this.data.map((it) => it.map((fl, i) => fl.reduce(
        (result, flt) => {
          const field = this.fields[Object.keys(this.fields)[i]];

          if(!field.methods.getFilterable) return result;
          const res = field.methods.getFilterable(flt);
          if(res) result.push(res);
          return result;
        }, [],
      )));
    },
    filterLists() {
      const filterLists = [];

      this.filterables.forEach((itm) => {
        itm.forEach((col, i) => {
          col.forEach((citm) => {
            if(!Array.isArray(filterLists[i])) filterLists[i] = [];
            if(!filterLists[i].includes(citm)) filterLists[i].push(citm);
          });
        });
      });

      return filterLists;
    },
    visibleItems() {
      return this.data.map((it, i) => {
        // Does search match
        if(this.search) {
          // Go through all fields of item
          // At least one searchable has to match
          const searchMatched = this.searchables[i].some(
            (fl) => {
              if(!Array.isArray(fl) || fl.length === 0) return true;
              return fl.some((fli) => fli.includes(this.search));
            },
          );
          if(!searchMatched) return false;
        }

        // Does filter match
        return this.filterables[i].every(
          (fl) => {
            if(!Array.isArray(fl) || fl.length === 0) return true;
            return fl.some((fli, ci) => {
              if(!Array.isArray(this.filter[ci]) || this.filter[ci].length === 0) return true;
              return this.filter[ci].includes(fli);
            });
          },
        );
      });
    },
  },

  methods: {},

  mounted() {
    // console.log(this.fields);
    console.log(this.filterLists);
  },
};
</script>

<style scoped>
.theme--light.v-data-table > .v-data-table__wrapper > table > tbody >
tr > td:not(.v-data-table__mobile-row),
.theme--light.v-data-table > .v-data-table__wrapper > table > tbody >
tr:not(:last-child) > th:not(.v-data-table__mobile-row) {
  border-bottom: thin solid rgba(0, 0, 0, 0.12);
}

.theme--dark.v-data-table > .v-data-table__wrapper > table > tbody >
tr > td:not(.v-data-table__mobile-row),
.theme--dark.v-data-table >  .v-data-table__wrapper > table > tbody >
tr > th:not(.v-data-table__mobile-row) {
  border-bottom: thin solid rgba(255, 255, 255, 0.12);
}
</style>
