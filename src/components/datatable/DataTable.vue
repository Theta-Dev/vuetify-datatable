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
    <v-simple-table
      class="datatable"
      dense
      :fixed-header="parseInt(fixedHeight) > 0"
      :height="`calc(100vh - ${fixedHeight}px)`"
    >
      <template v-slot:default>
        <thead>
          <!-- Headers -->
          <tr>
            <th
              v-for="(field, i) in fields"
              :key="field.name"
              :class="field.headCls"
            >
              <v-menu
                v-model="filter_menus[i]"
                offset-y
                :close-on-content-click="false"
                :disabled="!isFilterAvailable(i) && !isSortAvailable(i)"
              >
                <template v-slot:activator="{ on, attrs }">
                  <div
                    :class="{'primary--text': isFilterActive(i)}"
                    v-bind="attrs"
                    v-on="on"
                  >
                    {{ field.name }} {{ getSortIcon(i) }}
                  </div>
                </template>
                <v-card>
                  <div class="filter-menu">
                    <v-row
                      v-if="isSortAvailable(i)"
                      class="ma-0"
                    >
                      <v-col>
                        <v-btn
                          block
                          :color="isSortActive(i, true) ? 'primary' : ''"
                          @click="setSort(i, true)"
                        >
                          <v-icon>{{ icons.sortAZ }}</v-icon>
                        </v-btn>
                      </v-col>
                      <v-col>
                        <v-btn
                          block
                          :color="isSortActive(i, false) ? 'primary' : ''"
                          @click="setSort(i, false)"
                        >
                          <v-icon>{{ icons.sortZA }}</v-icon>
                        </v-btn>
                      </v-col>
                    </v-row>

                    <v-list
                      v-if="isFilterAvailable(i)"
                      dense
                    >
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
                              />
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
            </th>
          </tr>
        </thead>
        <tbody>
          <!-- Items -->
          <template v-for="(item, i_item) in tdata">
            <tr
              v-for="(n, i_itrow) in numItemRows[i_item]"
              v-show="visibleItems[i_item]"
              :key="i_item + '.' + i_itrow"
              :class="{'first-itrow': i_itrow===0, odd: i_item % 2}"
            >
              <template
                v-for="(col, i_col) in item"
              >
                <component
                  :is="fields[i_col].cell(col[i_itrow])"
                  v-if="(numItemRows[i_item] - col.length) === 0 || i_itrow===0"
                  :key="i_col"
                  :rowspan="(numItemRows[i_item] - col.length) === 0 ? 1 : numItemRows[i_item]"
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

import {
  mdiFilter, mdiMagnify,
  mdiSortAlphabeticalAscending, mdiSortAlphabeticalDescending,
} from '@mdi/js';

export default {
  name: 'DataTable',

  props: {
    fields: {
      type: Array,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
    title: {
      type: String,
      default: '',
    },
    fixedHeight: {
      type: String,
      default: '',
    },
  },

  data: () => ({
    icons: {
      search: mdiMagnify,
      filter: mdiFilter,
      sortAZ: mdiSortAlphabeticalAscending,
      sortZA: mdiSortAlphabeticalDescending,
    },
    // Togggle state of filter menus, [col_id] => state (bool)
    filter_menus: [],
    // Filter selections, [col_id] => sel_id[]
    filter_selections: [],
    // Search field input
    search: '',
    sort_selections: [],
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

        let cmp = this.fields[this.sort_col].compare(a, b);
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
          const res = this.fields[i_col].getSearchable(entry);
          if(res === null || res === undefined || res === '') return result;

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
          const res = this.fields[i_col].getFilterable(entry);
          if(res === null || res === undefined || res === '') return result;

          if(Array.isArray(res)) {
            res.forEach((ri) => {
              if(ri !== null && ri !== undefined && ri !== '') result.push(ri);
            });
          }
          else result.push(res);
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

      filterLists.forEach((list, i_col) => list.sort(
        (a, b) => this.fields[i_col].compareFilterable(a, b),
      ));
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

  mounted() {
  },

  methods: {
    isSortAvailable(i_col) {
      return this.fields[i_col].sortEnabled;
    },
    isSortActive(i_col, dir) {
      return i_col === this.sort_col && dir === this.sort_dir;
    },
    getSortIcon(i_col) {
      if(i_col === this.sort_col) return this.sort_dir ? '▼' : '▲';
      return '';
    },
    setSort(i_col, dir) {
      if(this.isSortActive(i_col, dir)) {
        this.sort_col = -1;
      }
      else {
        this.sort_col = i_col;
        this.sort_dir = dir;
      }
      this.filter_menus[i_col] = false;
    },
    // Can this column be filtered?
    isFilterAvailable(i_col) {
      return Array.isArray(this.filterLists[i_col]) && this.filterLists[i_col].length > 0;
    },
    // Is filter of certain column active
    isFilterActive(i_col) {
      return Array.isArray(this.filters[i_col]) && this.filters[i_col].length > 0;
    },
    // Remove the filter from a certain column
    clearFilter(i_col) {
      this.$set(this.filter_selections, i_col, []);
    },
  },
};
</script>

<style>
/* Thin border between columns */
.theme--light.v-data-table.datatable td,
.theme--light.v-data-table.datatable th {
  border-right: thin solid rgba(0, 0, 0, 0.12);
}

.theme--dark.v-data-table.datatable td:not(:last-child),
.theme--dark.v-data-table.datatable th:not(:last-child) {
  border-right: thin solid rgba(255, 255, 255, 0.12);
}

/* Thick border between items */
.theme--light.v-data-table.datatable tr.first-itrow > td {
  border-top: thin solid rgba(0, 0, 0, 0.25);
}

.theme--dark.v-data-table.datatable tr.first-itrow > td {
  border-top: thin solid rgba(255, 255, 255, 0.25);
}

/* No color change on hover, instead color odd rows */
.theme--light.v-data-table.datatable > .v-data-table__wrapper > table > tbody >
tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper),
.theme--dark.v-data-table.datatable > .v-data-table__wrapper > table > tbody >
tr:hover:not(.v-data-table__expanded__content):not(.v-data-table__empty-wrapper) {
    background: unset;
}

.theme--light.v-data-table.datatable > .v-data-table__wrapper > table > tbody > tr.odd {
  background: #eeeeee !important;
}

.theme--dark.v-data-table.datatable > .v-data-table__wrapper > table > tbody > tr.odd {
  background: #616161 !important;
}

.datatable > .v-data-table__wrapper > table > thead {
  box-sizing: content-box;
}

.datatable > .v-data-table__wrapper > table > thead > tr > th {
  white-space: nowrap;
}

th.tinycol, td.tinycol {
  min-width: 24px;
  max-width: 24px;
  overflow: hidden;
  text-align: center !important;
  padding: 0 !important
}

th.tinycol {
  height: 48px !important;
}

th.tinycol.rotated > div {
  transform: rotate(90deg);
}

.invisible-menu {
  background: none;
  border: none;
  box-shadow: none !important;
}

.invisible-menu > * {
  box-shadow: none !important;
}

.filter-menu {
  max-height: 50vh;
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
