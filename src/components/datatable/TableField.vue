<template>
<td :rowspan="rspan">
  <slot />
</td>
</template>

<script>
export default {
  name: 'TableField',

  props: {
    rspan: {
      type: Number,
      default: 1,
    },
  },
  /*
  computed: {
    searchMatched() {
      // If search is disabled, match always
      if(!this.searchable) return true;

      // Does search match?
      if(this.search) {
        if(!this.searchable.toLowerCase().includes(this.search.toLowerCase())) return false;
      }

      // Does filter match?
      if(Array.isArray(this.filter) && this.filter.length > 0) {
        if(this.filter.every((item) => this.searchable !== item)) return false;
      }

      return true;
    },
  }, */

  methods: {
    getSearchable() {
      return null;
    },
    getFilterable() {
      return null;
    },
  },
};
</script>

<style scoped>

</style>
