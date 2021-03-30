import TableField from './TableField';

export default class TableFieldTiny extends TableField {
  constructor(name, rotatedHeader) {
    super(name);
    this.headCls.push('tinycol');
    if(rotatedHeader) this.headCls.push('rotated');
  }

  cell(val) {
    return {
      render() {
        return (
          <td class="tinycol">
            {val}
          </td>
        );
      },
    };
  }
}
