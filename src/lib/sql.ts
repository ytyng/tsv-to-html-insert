import Papa from 'papaparse'

export const testTsvData = `
sku\tproduct_name\tprice\tcategory_code\tpublished_at\texpires_at\tdiscountable\tcreated_at\tupdated_at
CY-001\tAltair keyring\t1000\t1001\tNULL\tNULL\tFALSE\tNOW()\tNOW()
CY-002\tBetelgeuse magcup\t2000\t2001\t2024-01-01 0:00:00\tNULL\tTRUE\tNOW()\tNOW()
CY-003\tCanopus acrylic stand\t1500\t1001\tNULL\t2024-05-30 23:59:59\tTRUE\tNOW()\tNOW()
`.trim()

export const nativeSqlValues = new Set(['NULL', 'TRUE', 'FALSE', 'NOW()'])


function sqlValue(value: string) {
  if (nativeSqlValues.has(value)) {
    return value
  }
  if (/^\d+$/.test(value)) {
    return value
  }
  return `'${value}'`
}


export function convertTsvToInsertSQL(tsv: string, tableName: string) {
  const parsed = Papa.parse(tsv, {
    delimiter: '\t',
    header: false,
    skipEmptyLines: true,
  })
  console.log(parsed)
  const [columns, ...rows] = parsed.data

  const valuesLines = rows.map(row => {
    return `(${row.map(sqlValue).join(', ')})`
  })

  return `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES\n${valuesLines.join(',\n')};`
}
