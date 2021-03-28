# vuetify-datatable

Data table for Vuetify that supports search, column filtering and merged rows.

### Example table

| Name     | Task                       | Priority | Progress  | Status         |
|----------|----------------------------|----------|-----------|----------------| 
| ThetaDev | Feature: User registration | 🔸[mid]  | 65%       | Tests:❌ Pr:🔵 |
| ^^^^^^^^ | Documentation              | 🔹[low]  | 15%       | ^^             |
| Max      | Fix: API error             | 🔺[high] | 100%      | Tests:✅ Pr:✅ |

### Table structure

- Array of TableField objects
    - Array of TableField objects

```js
const structure = [
    new TableFieldText('Name'),
    new TableFieldText('Task'),
    new TableFieldIcon('Task',
        // Icons
        {1: ['triangle', 'red'], 2: ['square', 'orange'], 3: ['square', 'blue']},
        // Literal values
        {1: 'High', 2: 'Mid', 3: 'Low'},
        // Tooltips
        {1: 'High priority', 2: 'Medium priority', 3: 'Low priority'}),
    new TableFieldCustom('Progress',
        // Custom template
        '<custom-template />',
        // Literal function
        (data) => data.value + '%'),
    new TableField('Status',
        // Custom template
        '<custom-template />'),
]
```

### Table data

- Array of items
    - Array of colums
        - Array of data elements/objects

```js
const data = [
    [
        ['ThetaDev'],
        ['Feature: User registration', 'Documentation'],
        [2, 3],
        [65, 15],
        [2],
    ],
    [
        ['Max'],
        ['Fix: API error'],
        [2, 3],
        [65, 15],
        [2],
    ]
]
```

### TableField
TableFields define the structure of the table. This is the base class, from which
more specialized fields can be derived.

**Props:**
- searchable: Search/filterable string
- filter: Array of enabled filters from the respective column
- search: String from search bar

**Data:**
- searchMatched (computed): does search/filters apply to this field?

The template of the TableField has to be rendered inside the cell.


### TableFieldText
TableField for plain text.

**Props:**
- name: Column name
- val: Text
- filter + search (see above)


### TableFieldIcon
Table field showing an icon with optional tooltip.

**Props:**
- val: Icon key
- icons: Object with icons, colors, searchables and tooltips by icon key
- filter + search (see above)
