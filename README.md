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
    new TableFieldCustom('Status',
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
TableFields define the structure of the table and take care of
the following functions:

- get template for table cell rendering
- get template for tooltip rendering
- get filter data
- check if the field matches a filter/search string
