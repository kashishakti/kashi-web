interface TableData {
  columns: string[]
  values: string[][]
}

interface Props {
  data: TableData
}

export default function ContentTable({ data }: Props) {
  if (!data?.columns?.length || !data?.values?.length) return null
  return (
    <div className="content-table-wrap">
      <table className="content-table">
        <thead>
          <tr>
            {data.columns.map((col, i) => (
              <th key={i}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.values.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
