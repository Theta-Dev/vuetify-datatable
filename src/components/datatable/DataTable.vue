<template>
  <v-card>
    <v-card-title>
      DataTable
    </v-card-title>
    <v-card-text>
      <v-text-field
        v-model="search"
        label="Search..."
        prepend-icon="mdi-magnify"
        clearable
        hide-details
        single-line
      />
    </v-card-text>
    <v-simple-table>
      <template v-slot:default>
        <thead>
        <tr>
          <th
            v-for="(name, i) in Object.keys(fields)"
            :key="name"
          >
            <v-hover v-slot="{ hover }">
              <v-row no-gutters align="center">
                <v-col>
                  {{ name }}
                </v-col>
                <v-col class="text-right">
                  <v-btn icon :color="getFilterButtonColor(i, hover)">
                    <v-icon>mdi-filter</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-hover>
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
  </v-card>
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
    filter: [],
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
          const search = this.search.toLowerCase();
          // Go through all fields of item
          // At least one searchable has to match
          const searchMatched = this.searchables[i].some(
            (fl) => {
              if(!Array.isArray(fl) || fl.length === 0) return true;
              return fl.some((fli) => fli.includes(search));
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

  methods: {
    getFilterButtonColor(i, hover) {
      if(Array.isArray(this.filter[i]) && this.filter[i].length > 0) return 'primary';
      return hover ? '' : 'transparent';
    },
  },

  mounted() {
    // console.log(this.fields);
    // console.log(this.filterLists);
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
.theme--dark.v-data-table > .v-data-table__wrapper > table > tbody >
tr > th:not(.v-data-table__mobile-row) {
  border-bottom: thin solid rgba(255, 255, 255, 0.12);
}
</style>
