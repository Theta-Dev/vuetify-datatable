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
