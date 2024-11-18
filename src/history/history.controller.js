const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const HistoryService = require("./history.service");
const {
  createHistoryRecordBody,
  getHistoryRecordsQuery,
} = require("./history.validations");
const validate = require("../middlewares/validate");

class HistoryController {
  static boot(app) {
    const historyController = new HistoryController(new HistoryService());
    app.post(
      "/history",
      validate(createHistoryRecordBody),
      historyController.createRecord
    );
    app.get(
      "/history",
      validate(getHistoryRecordsQuery),
      historyController.getRecords
    );
  }
  /**
   * HistoryController constructor
   * @param {HistoryService} historyService
   */
  constructor(historyService) {
    this.historyService = historyService;
  }

  createRecord = catchAsync(async (req, res) => {
    const { action, plu, shopId } = req.body;
    const record = await this.historyService.createRecord({
      action,
      plu,
      shopId,
    });
    res.status(httpStatus.CREATED).send(record);
  });

  getRecords = catchAsync(async (req, res) => {
    const {
      page_after,
      page_before,
      page_size,
      plu,
      shop_id,
      action,
      date_from,
      date_to,
    } = req.query;
    const records = await this.historyService.getRecords(
      {
        plu,
        shopId: shop_id,
        action: action,
        dateFrom: date_from,
        dateTo: date_to,
      },
      page_size,
      page_after,
      page_before
    );
    res.send(records);
  });
}

module.exports = HistoryController;
