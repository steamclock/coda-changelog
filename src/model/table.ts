export interface Column {
  id: string
  type: string
  name: string
  href: string
  display: true
}

export interface Row {
  cells: [TableCell]
}

export interface TableCell {
  column: string //Column Id
  value: string
}
