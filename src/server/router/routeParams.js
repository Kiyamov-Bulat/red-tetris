class RouteParams {
    static routeParams = {};

    static matchAllRouteParams(requestPath, routePath) {
        const { groups } = routePath.exec(requestPath);

        this.setAll(groups);
    }

    static setAll(aRouteParams) {
        this.routeParams = aRouteParams;
    }

    static set(key, value) {
        this.routeParams[key] = value;
    }

    static getAll() {
        return { ...this.routeParams };
    }

    static get(key) {
        return this.routeParams[key];
    }
}

export default RouteParams;
