import { csvParse, autoType } from 'd3-dsv';

function FileUpload({ onFileParsed }) {
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      readCSVFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      readCSVFile(file);
    }
  };

  const readCSVFile = (file) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      const parsedData = csvParse(text, autoType);
      onFileParsed(parsedData); // Send parsed data back to parent
    };
    reader.onerror = (error) => {
      console.error('Error reading CSV file:', error);
    };
    reader.readAsText(file);
  };

  return (
    <div
      className="rounded-lg bg-base-200 h-auto border-dashed border-2 border-gray-400 flex justify-center items-center cursor-pointer mx-4 py-4"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <label htmlFor="file-upload" className="hero-content text-center max-w-md flex flex-col justify-center items-center">
        <p className="py-6">Drag and drop or click to upload a CSV file to get started</p>
        <input
          id="file-upload"
          type="file"
          accept=".csv"
          className="file-input file-input-ghost w-full max-w-xs hidden"
          onChange={handleFileUpload}
        />
      </label>
    </div>
  );
}

export default FileUpload;
