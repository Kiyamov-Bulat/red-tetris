import React from 'react';
import {formatDateString} from "../../../utils/formatDateString";

const GameUnit = ({ game }) => {

    return (
        <div>
            <p>[{game.id}] createdAt: {formatDateString(game.createdAt)}</p>
        </div>
    );
};

export default GameUnit;