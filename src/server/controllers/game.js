import RouteParams from "../router/routeParams";

export default {
    create(req, res) {
        Game
    },
    connect(req, res) {
        const gameId = RouteParams.get('roomId');
        const playerId = RouteParams.get('playerId');


    },
    start(req, res) {

    },
    restart(req, res) {

    }
};