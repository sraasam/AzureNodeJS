var express = require("express");
var app = express();
var port = 1337;
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

//Load the respective models 
const customerModule = require('./models/customers');
const custBudgetModule = require('./models/customerBudget');
const custChkinModule = require('./models/customerCheckinInfo');
const custApptModule = require('./models/customerAppointment');
const custOrderModule = require('./models/customerOrder');

//load mongoose and create the connection object with the respective mongo db
var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/maestro-local");

//fetch the respective collection objects from Mongo DB for each model accordingly
var customerSchema = new mongoose.Schema(customerModule);
var Customers = mongoose.model('customers', customerSchema);

var custBudgetSchema = new mongoose.Schema(custBudgetModule);
var CustBudget = mongoose.model('customersbudgets', custBudgetSchema);

var custChkinSchema = new mongoose.Schema(custChkinModule);
var CustChkin = mongoose.model('customercheckininfos', custChkinSchema);

var custApptSchema = new mongoose.Schema(custApptModule);
var CustAppt = mongoose.model('customerappointments', custApptSchema);

var custOrderSchema = new mongoose.Schema(custOrderModule);
var CustOrder = mongoose.model('customerorders', custOrderSchema);




app.get("/displayReport", (req, res) => {
    /*console.log(req.query.reportType);
    console.log(req.query.stDate);
    console.log(req.query.endDate);*/
    switch (req.query.reportType) {
        case 'customers':
            return showCustomers(req, res).then(function (custList) {
                res.send(custList);
            });
            break;
        case 'customer_checkins':
            return showCustCheckins(req, res).then(function (custChkinList) {
                res.send(custChkinList);
            });
            break;
        case 'customer_source':
            return showCustApptsSrc(req, res).then(function (custApptsSrcList) {
                res.send(custApptsSrcList);
            });
            break;
        case 'customer_vehicle_searches':
            return showCustVehlSearch(req, res).then(function (custVehlSearchList){
                res.send(custVehlSearchList);
            });
            break;
        case 'customer_purchase':
            return showCustOrders(req, res).then(function (custOrder) {
                res.send(custOrder);
            });

            break;
        case 'customer_appointments':
            return showAppts(req, res).then(function (custOrder) {
                res.send(custOrder);
            });
            break;

        default:
            res.send("Data Not Available!!");
    }

});

function showCustomers(req, res) {
    return listCustomers(req, res).then(function (custList) {
        return custList;
    }).catch(function (err) {
        return "Exception_Occured";
    });
}

var format = function (input) {
    var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
    if (!input || !input.match(pattern)) {
        return null;
    }
    // console.log("formatted date"+input.replace(pattern, '$2/$3/$1'));
    return input.replace(pattern, '$2/$3/$1');
};

function listCustomers(req, res) {
    if (req.query.stDate && req.query.endDate) {
        var customerJson = Customers.find({ createdAt: { $gte: new Date(req.query.stDate), $lt: new Date(req.query.endDate) } }).exec(function (err, customerJson) {
        });
    } else if (req.query.stDate) {
        var startDate = new Date(format(req.query.stDate));

        var strEndDate = new Date(format(req.query.stDate));
        var endDate = strEndDate.setTime(strEndDate.getTime() + 1 * 86400000); //next day
        var endDateObj = new Date(endDate);

        var startDateMonth = startDate.getMonth() + 1;
        var endDateMonth = endDateObj.getMonth() + 1;

        var startDateStr = startDate.getFullYear() + "-" + startDateMonth + "-" + startDate.getDate();
        var endDateStr = endDateObj.getFullYear() + "-" + endDateMonth + "-" + endDateObj.getDate();

        var customerJson = Customers.find({ createdAt: { $gte: new Date(startDateStr), $lt: new Date(endDateStr) } }).exec(function (err, customerJson) {


        });

    }
    return customerJson;

}

function showCustCheckins(req, res) {
    return custCheckinsRS(req, res).then(function (custChkIns) {
        return custChkIns;
    }).catch(function (err) {
        return "Exception_Occured";
    });
}

function custCheckinsRS(req, res) {
    /*var custChkInsJson = CustChkin.find({
        pacode: {
            $in: [
                '05769'
            ]
        },
        $and: [
            {
                checkinTime: {
                    $gte: new Date('2018-08-21')
                }
            },
            {
                checkoutTime: {
                    $gte: new Date('2018-08-21')
                }
            }
        ]
    }).exec(function (err, custChkInsJson) {
    });*/
    if (req.query.stDate && req.query.endDate) {
        var custChkInsJson = CustChkin.find({ createdAt: { $gte: new Date(req.query.stDate), $lt: new Date(req.query.endDate) } }).exec(function (err, custChkInsJson) {
        });
    } else if (req.query.stDate) {
        var startDate = new Date(format(req.query.stDate));

        var strEndDate = new Date(format(req.query.stDate));
        var endDate = strEndDate.setTime(strEndDate.getTime() + 1 * 86400000); //next day
        var endDateObj = new Date(endDate);

        var startDateMonth = startDate.getMonth() + 1;
        var endDateMonth = endDateObj.getMonth() + 1;

        var startDateStr = startDate.getFullYear() + "-" + startDateMonth + "-" + startDate.getDate();
        var endDateStr = endDateObj.getFullYear() + "-" + endDateMonth + "-" + endDateObj.getDate();


        var custChkInsJson = CustChkin.find({ checkinTime: { $gte: new Date(startDateStr), $lt: new Date(endDateStr) } }).exec(function (err, custChkInsJson) {

        });

    }

    return custChkInsJson;
}

function showCustOrders(req, res) {
    return custOrderRS(req, res).then(function (searchList) {
        return searchList;
    }).catch(function (err) {
        console.log(err);
        return "Exception_Occured";
    });
}

function custOrderRS(req, res) {
    if (req.query.stDate && req.query.endDate) {
        var query = [
            {
                $match: {
                    createdAt: {
                        $gte: new Date(req.query.stDate),
                        $lt: new Date(req.query.endDate)
                    }
                }
            }, {
                $lookup: {
                    from: 'customers',
                    localField: 'customerId',
                    foreignField: 'fdOipGuid',
                    as: 'custOrderRS'
                }
            }
        ];

        var custOrderJson = CustOrder.aggregate(query).exec((err, custOrderJson) => {
            if (err) throw err;
        });
    } else if (req.query.stDate) {
        var startDate = new Date(format(req.query.stDate));

        var strEndDate = new Date(format(req.query.stDate));
        var endDate = strEndDate.setTime(strEndDate.getTime() + 1 * 86400000); //next day
        var endDateObj = new Date(endDate);

        var startDateMonth = startDate.getMonth() + 1;
        var endDateMonth = endDateObj.getMonth() + 1;

        var startDateStr = startDate.getFullYear() + "-" + startDateMonth + "-" + startDate.getDate();
        var endDateStr = endDateObj.getFullYear() + "-" + endDateMonth + "-" + endDateObj.getDate();

        var query = [
            {
                $match: {
                    createdAt: {
                        $gte: new Date(startDateStr),
                        $lt: new Date(endDateStr)
                    }
                }
            }, {
                $lookup: {
                    from: 'customers',
                    localField: 'customerId',
                    foreignField: 'fdOipGuid',
                    as: 'custOrderRS'
                }
            }
        ];

        var custOrderJson = CustOrder.aggregate(query).exec((err, custOrderJson) => {
            if (err) throw err;
        });

    }

    return custOrderJson;
}

function showAppts(req, res) {
    return listAppts(req, res).then(function (apptsList) {
        return apptsList;
    }).catch(function (err) {
        return "Exception_Occured";
    });
}

function listAppts(req, res) {
    if (req.query.stDate && req.query.endDate) {
        var startDate = new Date(format(req.query.stDate));
        var endDate = new Date(format(req.query.endDate));


        var epochStDate = Date.parse(startDate).toString();
        var epochEndDate = Date.parse(endDate).toString();
        console.log("startDate" + typeof epochStDate);
        console.log("endDateObj" + typeof epochEndDate);
        var apptJson = CustAppt.find({ 'records.data.appointmentEpoch': { $gte: epochStDate, $lt: epochEndDate } }).exec(function (err, apptJson) {


        });

    } else if (req.query.stDate) {
        var startDate = new Date(format(req.query.stDate));
        var strEndDate = new Date(format(req.query.stDate));
        var endDate = strEndDate.setTime(strEndDate.getTime() + 1 * 86400000); //next day
        var endDateObj = new Date(endDate);


        var epochStDate = Date.parse(startDate).toString();
        var epochEndDate = Date.parse(endDateObj).toString();
        console.log("startDate" + typeof epochStDate);
        console.log("endDateObj" + typeof epochEndDate);
        var apptJson = CustAppt.find({ 'records.data.appointmentEpoch': { $gte: epochStDate, $lt: epochEndDate } }).exec(function (err, apptJson) {


        });

    }
    return apptJson;

}

app.listen(port, () => {
    console.log("Server listening on port " + port);
});

