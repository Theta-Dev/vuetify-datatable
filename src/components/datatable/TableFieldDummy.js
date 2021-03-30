import TableField from './TableField';

export default class TableFieldDummy extends TableField {
  getSearchable() {
    return null;
  }

  getFilterable() {
    return null;
  }
}
