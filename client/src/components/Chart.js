import React from 'react';
import { VegaLite } from 'react-vega';

function Chart({ spec, data }) {
  const specWithData = {
    ...spec,
    data: {
        name: 'data',
    },
  };

  const vegaData = {
    data: data
  };
  return (
    <div className="flex justify-center rounded-lg"> 
      <VegaLite spec={specWithData} data={vegaData} />
    </div>
  );
}
export default Chart;
