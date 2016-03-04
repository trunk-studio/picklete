/**
 * ReportController
 *
 * @description :: Server-side logic for managing Payments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
import fs from 'fs';
import xlsx from 'node-xlsx';
import _ from 'lodash';
import moment from 'moment';
import allPayPaymentTypeJson from '../../config/allpayPaymentType.json';

module.exports = {
  export: async (req, res) => {
    let date = req.body.date;

    let excel = await ReportService.create(date);

    await res.download(excel);

    // await fs.unlink(excel);
  },

  list: async (req, res) => {

    let list = await ReportService.list();

    return res.ok(list);
  },

  // reportData: async (req, res) => {
  //
  //   let rep
  // },

  ordersReportData: async (req, res) => {
    let query = req.query;
    let queryResult = await OrderService.query(query);
    console.log('!!!!!!!!!!!!!!', JSON.stringify(queryResult.orders.rows,null,4));

    let reportData = {
      orders: queryResult.orders.rows,
      ordersPaymentTotal: queryResult.ordersPaymentTotal
    };
    // console.log(JSON.stringify(reportData,null,4));

    return res.ok(reportData);
  },

  ordersReportPage: async (req, res) => {
    try {
      let query = req.query;
      let page = req.session.UserController_controlMembers_page =
      parseInt(req.param('page',
        req.session.UserController_controlMembers_page || 0
      ));

      let limit = req.session.UserController_controlMembers_limit =
      parseInt(req.param('limit',
        req.session.UserController_controlMembers_limit || 10
      ));

      let queryResult = await OrderService.query(query, page, limit);

      // console.log('-------query----------',JSON.stringify(queryResult.orders.rows,null,4));
      // console.log('================ ================ ================');

      // console.log('------------------------------------');
      // console.log(JSON.stringify(allPayPaymentTypeJson,null,4));

      return res.view('report/order',{
        orders: queryResult.orders,
        ordersPaymentTotal: queryResult.ordersPaymentTotal,
        query,
        page,
        limit,
        allPayPaymentTypeJson
      });
    } catch (error) {
      return res.serverError(error);
    }
  }

};
