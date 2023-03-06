import sessionStorageService from "../services/sessionStorageService";
import {selectPlayerScore} from "../store/selectors/player";
import {selectPlayers} from "../store/selectors/game";

const PlayerModel = {
    getPlayerScoreSelector: (playerId) => {
        if (playerId === sessionStorageService.getSessionId()) {
            return selectPlayerScore;
        }
        return (state) => {
            const players = selectPlayers(state);

            return players.find((next) => next.id === playerId)?.score || 0;
        };
    }
};

export default PlayerModel;