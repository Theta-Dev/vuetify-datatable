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
                        <v-icon>mdi-filter</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
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
                      <v-list-item-group
                        v-show="isFilterActive(i)"
                        mandatory
                      >
                        <v-list-item
                          color="red"
                          @click="clearFilter(i)"
                        >Clear filter</v-list-item>
                      </v-list-item-group>
                    </v-list>
                  </v-menu>
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
    filter_menus: [],
    filter_selections: [],
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
    filter() {
      return this.filter_selections.map((selection, column) => selection.map(
        (itm) => this.filterLists[column][itm],
      ));
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
        console.log('Filterables', i, this.filterables[i]);

        return this.filterables[i].every(
          (fl, ci) => {
            console.log('fl', fl);
            console.log('Filter', this.filter[ci]);
            if(!Array.isArray(fl) || fl.length === 0) return true;
            return fl.some((fli) => {
              console.log('fli', ci, fli);
              if(!Array.isArray(this.filter[ci]) || this.filter[ci].length === 0) return true;
              return this.filter[ci].includes(fli);
            });
          },
        );
      });
    },
  },

  methods: {
    isFilterActive(i) {
      return Array.isArray(this.filter[i]) && this.filter[i].length > 0;
    },
    getFilterButtonColor(i, hover) {
      if(this.isFilterActive(i)) return 'primary';
      return hover ? '' : 'transparent';
    },
    clearFilter(i) {
      this.$set(this.filter_selections, i, []);
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
