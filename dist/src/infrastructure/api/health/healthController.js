"use strict";
const { ApiResponse } = require("../contracts");
function health(req, res) {
    return res.json(ApiResponse.ok({
        req,
        data: { status: "ok", transport: "http" },
    }));
}
module.exports = { health };
//# sourceMappingURL=healthController.js.map