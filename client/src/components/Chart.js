import React from 'react';
import { VegaLite } from 'react-vega';

function Chart({ spec }) {
  const specWithData = {
    ...spec,
    width: 225, 
    height: 225,
    }



  return (
    <div className="flex justify-center ml-10 my-3"> 
      <VegaLite spec={specWithData} />
    </div>
  );
}
export default Chart;
