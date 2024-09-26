import React from 'react';
import { VegaLite } from 'react-vega';

function Chart({ spec, data }) {
  const specWithData = {
    ...spec,
    width: 225, 
    height: 225,
    data: {
        name: 'data',
    },
  };

  const vegaData = {
    data: data
  };
  return (
    <div className="flex justify-center ml-10 my-3"> 
      <VegaLite spec={specWithData} data={vegaData} />
    </div>
  );
}
export default Chart;
