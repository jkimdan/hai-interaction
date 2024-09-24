function TablePreview({ csvData, showTable, toggleTable }) {
    return (
      <>
        {csvData.length > 0 && showTable && (
          <div className="flex-1 bg-white shadow-lg rounded-lg overflow-y-auto border border-gray-300 mb-0 mt-3 mx-4 px-4">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  {csvData.columns.map((header, index) => (
                    <th key={index} className="px-4 py-2 border">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {csvData.slice(0, 10).map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {csvData.columns.map((column, colIndex) => (
                      <td key={colIndex} className="px-4 py-2 border">{row[column]}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {csvData.length > 0 && (
          <div className="flex justify-center px-4 mt-2">
            <button className="btn btn-sm btn-secondary" onClick={toggleTable}>
              {showTable ? 'Hide Table Preview' : 'Show Table Preview'}
            </button>
          </div>
        )}
      </>
    );
  }
  
  export default TablePreview;
  