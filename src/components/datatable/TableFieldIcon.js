import { VIcon, VTooltip } from 'vuetify/lib';

import TableFieldTiny from './TableFieldTiny';

export default class TableFieldIcon extends TableFieldTiny {
  constructor(name, icons, rotatedHeader) {
    super(name, rotatedHeader);
    this.icons = icons;
  }

  cell(val) {
    const { icons } = this;

    return {
      render() {
        return (
          <td class="tinycol">
            <VTooltip top
            scopedSlots={{
              activator: ({ on }) => <VIcon {...{ on }} color={icons[val][2]}>
                {icons[val][1]}
              </VIcon>,
            }}>
              <span>{icons[val][0]}</span>
            </VTooltip>
          </td>
        );
      },
    };
  }

  getSearchable(val) {
    return this.icons[val][0];
  }

  getFilterable(val) {
    return this.icons[val][0];
  }
}
