<template>
  <TableField
    :rspan="rspan"
  >
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-icon
          v-bind="attrs"
          v-on="on"
          :color="icon[1]"
        >
          {{ icon[0] }}
        </v-icon>
      </template>
      <span>
        {{ icon[2] }}
      </span>
    </v-tooltip>
  </TableField>
</template>

<script>
import TableField from '@/components/datatable/TableField.vue';

const ICONS = {
  0: ['mdi-domain', 'green', 'Domain'],
  1: ['mdi-message-text', 'blue', 'Message'],
  2: ['mdi-dialpad', 'purple', 'Dial'],
};

export default {
  name: 'TableFieldIcon',
  components: { TableField },

  props: {
    rspan: Number,
    val: Number,
  },

  computed: {
    icon() {
      return ICONS[this.val];
    },
  },

  methods: {
    getFilterable(val) {
      return ICONS[val][2];
    },
  },
};
</script>
