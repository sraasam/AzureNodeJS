module.exports = {
    model: {
        fdOipGuid: {
            type: String,
            index: true,
            required: true
        },
        checkedInBy: {
            type: String
        },

        data: {
            firstName: {
                type: Object,
                required: true
            },

            middleName: {
                type: Object,
            },

            lastName: {
                type: Object,
                required: true
            },

            legalfirstName: {
                type: Object
            },

            legalmiddleName: {
                type: Object,
            },

            legallastName: {
                type: Object,
            },
            type: {
                type: Object,
            },

            title: {
                type: Object,
            },
            companyName: {
                type: Object
            },

            birthDateEpoch: {
                type: Object
            },
        },

        pacode: {
            type: String,
            required: true,
        },

        createUser: {
            type: String,
            required: true
        },

        active: {
            type: Boolean,
            default: true
        },

        method: {
            type: String,
        },
        dataVerified: {
            type: Boolean,
            default: false
        },
        source: {
            type: String,
            default: 'SC2'
        },

        incentives: {
            type: Array
        },

        invoiceMetaData: {
            type: Array
        },
        lPersonId: {
            type: String
        },
        companyId: {
            type: String
        },
        cksId: {
            type: String
        },
        lDealId: {
            type: String
        },
        comment: {
            type: String
        }

    }
};