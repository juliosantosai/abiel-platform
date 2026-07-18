"use strict";
function getApiV1Paths() {
    return ["/api", "/api/v1"];
}
function isInternalPath(pathname = "") {
    return pathname.startsWith("/api/internal");
}
module.exports = {
    getApiV1Paths,
    isInternalPath,
};
//# sourceMappingURL=ApiVersioning.js.map