"use strict";
require("dotenv").config();
const env = {
    NODE_ENV: process.env.NODE_ENV || "development",
    APP_NAME: process.env.APP_NAME || "abiel-core",
    PORT: Number(process.env.PORT || 3000),
    DATABASE_URL: process.env.DATABASE_URL
};
module.exports = env;
//# sourceMappingURL=env.js.map