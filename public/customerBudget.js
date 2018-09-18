module.exports = {
    model: {
        customerId: {
            type: String,
            required: true
        },
        cash: {
            type: Boolean,
            default: false
        },
        lease: {
            type: Boolean,
            default: false
        },
        finance: {
            type: Boolean,
            default: false
        },
        prefLeaseTerm: {
            type: String
        },
        prefFinTerm: {
            type: String
        },
        annualMiles: {
            type: String
        },
        minTMP: {
            type: Number
        },
        maxTMP: {
            type: Number
        },
        minTCD: {
            type: Number
        },
        maxTCD: {
            type: Number
        },
        creditHealth: {
            type: String
        },
        scoreVerify: {
            type: Boolean
        }
    }
};