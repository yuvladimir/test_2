const prisma = require("../client");
const dayjs = require("dayjs");
const customParseFormat = require("dayjs/plugin/customParseFormat");
var utc = require("dayjs/plugin/utc");
dayjs.extend(utc);
dayjs.extend(customParseFormat);

class HistoryService {
  /**
   *
   * @param {string} action
   * @param {number} filters.plu
   * @param {number | undefined} filters.shopId
   * @returns
   */
  createRecord = async (dto) => {
    await prisma.records.create({
      data: {
        action: dto.action,
        plu: dto.plu,
        shopId: dto.shopId,
      },
    });
  };

  /**
   *
   * @param {Object} filters
   * @param {number} [filters.plu]
   * @param {number} [filters.shopId]
   * @param {string} [filters.action]
   * @param {string} [filters.dateFrom]
   * @param {string} [filters.dateTo]
   *    * @param {string} [pageAfter]
   * @param {string} [pageBefore]
   * @param {number} [pageSize]
   * @returns
   */

  getRecords = async (
    { plu, shopId, action, dateFrom, dateTo },
    pageSize = 10,
    pageAfter,
    pageBefore
  ) => {
    let cursor = { limit: pageSize };
    if (pageAfter) {
      cursor.after = pageAfter;
    }
    if (pageBefore) {
      cursor.before = pageBefore;
    }
    const createdAtFilter = {};
    if (dateFrom != null) {
      const parsed = dayjs(dateFrom, "DD.MM.YYYY");
      createdAtFilter["gte"] = parsed.utc(true).toDate();
    }
    if (dateTo != null) {
      const parsed = dayjs(dateTo, "DD.MM.YYYY");
      createdAtFilter["lt"] = parsed.utc(true).add(1, "day").toDate();
    }
    const [records, meta] = await prisma.records
      .paginate({
        select: {
          id: true,
        },
        where: {
          plu,
          shopId,
          action,
          createdAt: createdAtFilter,
        },
      })
      .withCursor(cursor);

    return {
      meta,
      data: records,
    };
  };
}

module.exports = HistoryService;
