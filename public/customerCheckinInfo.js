module.exports = {
  model: {
    pacode: {
      type: String,
      required: true
    },

    salesRepId: {
      type: String,
      required: true
    },

    customerId: {
      type: String,
      required: true
    },

    checkinTime: {
      type: Date,
      default: Date.now
    },

    checkinStatus: {
      type: Boolean,
      default: true
    },

    checkoutTime: {
      type: Date
    }
  }
};