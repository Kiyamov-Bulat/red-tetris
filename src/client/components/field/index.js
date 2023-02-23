import React from 'react';
import Line from "./line";

const Field = ({ state }) => {
    return (
        <div>
            {state.map((cubes, idx) => <Line key={idx} index={idx} cubes={cubes}/>)}
        </div>
    );
};

export default Field;