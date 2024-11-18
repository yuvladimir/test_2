const { PrismaClient } = require("@prisma/client");
const { pagination } = require("prisma-extension-pagination");
const config = require("./config/config");

const prisma = global.prisma || new PrismaClient().$extends(pagination());
if (config.env === "development") global.prisma = prisma;
module.exports = prisma;
