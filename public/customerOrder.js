module.exports = {
    model: {
          customerId: {
              type: String,
              required: true
          },
          vin:{
              type: String
          },
          buyersOrder: {
              type: Object
          }
    }
  };