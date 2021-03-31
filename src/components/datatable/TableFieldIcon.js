import { VIcon, VTooltip } from 'vuetify/lib';

import TableField from './TableField';

export default class TableFieldIcon extends TableField {
  constructor(name, icons, tiny, rotatedHeader) {
    super(name);
    if(tiny) this.headCls.push('tinycol');
    if(rotatedHeader) this.headCls.push('rotated');
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
