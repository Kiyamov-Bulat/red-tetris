import React from 'react';
import Button from "../../../components/button";

const Player = ({ state }) => {
    return (
        <div>
            <p>{state.name || state.id}</p>
            <Button/>
        </div>
    );
};

export default Player;