<template>
  <v-card>
    <v-card-title v-if="title">
      {{ title }}
    </v-card-title>
    <v-card-text class="pt-1">
      <v-text-field
        v-model="search"
        label="Search..."
        :prepend-icon="icons.search"
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
              <table style="width: 100%">
                <tr>
                  <td @click="toggleSort(i)">
                    {{ getSortIcon(i) }} {{ name }}
                  </td>
                  <td
                    v-if="isFilterAvailable(i)"
                    class="text-right"
                  >
                    <v-menu
                      v-model="filter_menus[i]"
                      offset-y
                      :close-on-content-click="false"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          icon
                          :color="getFilterButtonColor(i, hover || filter_menus[i])"
                          v-on="on"
                          v-bind="attrs"
                        >
                          <v-icon>{{ icons.filter }}</v-icon>
                        </v-btn>
                      </template>
                      <v-card>
                        <div style="max-height: 500px; overflow-y: auto">
                          <v-list dense>
                            <v-list-item-group
                              v-model="filter_selections[i]"
                              multiple
                            >
                              <v-list-item
                                v-for="item in filterLists[i]"
                                :key="item"
                              >
                                <template v-slot:default="{ active }">
                                  <v-list-item-content>
                                    <v-list-item-title>{{ item }}</v-list-item-title>
                                  </v-list-item-content>

                                  <v-list-item-action>
                                    <v-checkbox
                                      :input-value="active"
                                      color="primary"
                                    ></v-checkbox>
                                  </v-list-item-action>
                                </template>
                              </v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </div>
                        <div v-show="isFilterActive(i)">
                          <v-list dense>
                            <v-list-item-group mandatory>
                              <v-list-item
                                color="red"
                                @click="clearFilter(i)"
                              >
                                <v-list-item-title>Clear filter</v-list-item-title>
                              </v-list-item>
                            </v-list-item-group>
                          </v-list>
                        </div>
                      </v-card>
                    </v-menu>
                  </td>
                </tr>
              </table>
            </v-hover>
          </th>
        </tr>
        </thead>
        <tbody>
        <template v-for="(item, i_item) in tdata">
          <tr
            v-for="(n, i_itrow) in numItemRows[i_item]"
            :key="i_item + '.' + i_itrow"
            v-show="visibleItems[i_item]"
          >
            <template
              v-for="(col, i_col) in item"
            >
              <component
                v-if="(numItemRows[i_item] - col.length) === 0 || i_itrow===0"
                :key="i_col"
                :is="fields[Object.keys(fields)[i_col]]"
                :rspan="(numItemRows[i_item] - col.length) === 0 ? 1 : numItemRows[i_item]"
                :val="col[i_itrow]"
                :filter="filters"
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

import { mdiFilter, mdiMagnify } from '@mdi/js';

export default {
  name: 'DataTable',

  props: {
    fields: Object,
    data: Array,
    title: String,
  },

  data: () => ({
    icons: {
      search: mdiMagnify,
      filter: mdiFilter,
    },
    // Togggle state of filter menus, [col_id] => state (bool)
    filter_menus: [],
    // Filter selections, [col_id] => sel_id[]
    filter_selections: [],
    // Search field input
    search: '',
    // Sorting direction: true^=A-Z, false^=Z-a
    sort_dir: true,
    // Column to be sorted
    sort_col: 0,
  }),

  computed: {
    tdata() {
      const tdata = [...this.data];
      if(!(this.sort_col > -1)) return tdata;

      return tdata.sort((item_a, item_b) => {
        const a = item_a[this.sort_col][0];
        const b = item_b[this.sort_col][0];

        let cmp = this.getSortFuction(this.sort_col)(a, b);
        if(!this.sort_dir) cmp *= -1;
        return cmp;
      });
    },
    // The amount of rows occupied by each table item, [i_item] => num_rows
    numItemRows() {
      return this.tdata.map((it) => it.map((fl) => fl.length).reduce((a, b) => Math.max(a, b)));
    },
    // Walk through the tdata object and obtain the searchable string for each value
    // [i_item] => [i_col] => [i_entry] => searchable
    searchables() {
      return this.tdata.map((item) => item.map((col, i_col) => col.reduce(
        (result, entry) => {
          const field = this.fields[Object.keys(this.fields)[i_col]];

          if(!('methods' in field) || !('getSearchable' in field.methods)) return result;
          const res = field.methods.getSearchable(entry);
          result.push(res);
          return result;
        }, [],
      )));
    },
    // Walk through the tdata object and obtain the filterable string for each value
    // [i_item] => [i_col] => [i_entry] => filterable
    filterables() {
      return this.tdata.map((item) => item.map((col, i_col) => col.reduce(
        (result, entry) => {
          const field = this.fields[Object.keys(this.fields)[i_col]];

          if(!('methods' in field) || !('getFilterable' in field.methods)) return result;
          const res = field.methods.getFilterable(entry);
          result.push(res);
          return result;
        }, [],
      )));
    },
    // Accumulate filterables for all columns to be shown in the filter menus
    // [i_col] => filterable[]
    filterLists() {
      const filterLists = [];

      this.filterables.forEach((item) => {
        item.forEach((col, i_col) => {
          col.forEach((filterable) => {
            if(!Array.isArray(filterLists[i_col])) filterLists[i_col] = [];
            if(filterable !== '' && filterable !== null && !filterLists[i_col].includes(filterable)) {
              filterLists[i_col].push(filterable);
            }
          });
        });
      });

      filterLists.forEach((list, i_col) => list.sort(this.getSortFuction(i_col)));
      return filterLists;
    },
    // Selected filters for each column
    // [i_col] => filterable[] (selected)
    filters() {
      return this.filter_selections.map((selection, col) => selection.map(
        (i_sel) => this.filterLists[col][i_sel],
      ));
    },
    // Visibility state of each item (not sorted out by filter/search)
    // [i_itm] => visible (bool)
    visibleItems() {
      return this.tdata.map((item, i_item) => {
        // Does search match
        if(this.search && this.search.trim()) {
          // Split search input to get individual words, lowercase them
          // for casse insensitivity and filter out empty words
          const searchWords = this.search.toLowerCase().split(' ').filter(
            (word) => word.trim(),
          );
          // Go through all search words
          // Go through all fields of item
          // At least one searchable has to match one search word
          const searchMatched = searchWords.some((word) => this.searchables[i_item].some(
            (col) => {
              if(!Array.isArray(col) || col.length === 0) return false;
              return col.some((entry) => entry.includes(word));
            },
          ));
          if(!searchMatched) return false;
        }

        // Does filter match
        return this.filterables[i_item].every(
          (col, i_col) => {
            if(!Array.isArray(col) || col.length === 0) return true;
            return col.some((entry) => {
              if(!Array.isArray(this.filters[i_col]) || this.filters[i_col].length === 0) {
                return true;
              }
              return this.filters[i_col].includes(entry);
            });
          },
        );
      });
    },
  },

  methods: {
    getSortFuction(i_col) {
      const field = this.fields[Object.keys(this.fields)[i_col]];
      if(!('methods' in field) || !('sortFunction' in field.methods)) {
        return (a, b) => {
          // INFO: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
          // ECMA specification: http://www.ecma-international.org/ecma-262/6.0/#sec-sortcompare

          if(a === undefined && b === undefined) return 0;
          if(a === undefined) return 1;
          if(b === undefined) return -1;

          const aString = a.toString();
          const bString = b.toString();

          if(aString < bString) return -1;
          if(aString > bString) return 1;

          return 0;
        };
      }
      return field.methods.sortFunction;
    },
    getSortIcon(i_col) {
      if(i_col === this.sort_col) return this.sort_dir ? '▼' : '▲';
      return '';
    },
    toggleSort(i_col) {
      if(i_col === this.sort_col) this.sort_dir = !this.sort_dir;
      else {
        this.sort_col = i_col;
        this.sort_dir = true;
      }
    },
    // Can this column be filtered?
    isFilterAvailable(i_col) {
      return Array.isArray(this.filterLists[i_col]) && this.filterLists[i_col].length > 0;
    },
    // Is filter of certain column active
    isFilterActive(i_col) {
      return Array.isArray(this.filters[i_col]) && this.filters[i_col].length > 0;
    },
    // Get the color of the filter button
    getFilterButtonColor(i_col, hover) {
      if(this.isFilterActive(i_col)) return 'primary';
      return hover ? '' : 'transparent';
    },
    // Remove the filter from a certain column
    clearFilter(i_col) {
      this.$set(this.filter_selections, i_col, []);
    },
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
