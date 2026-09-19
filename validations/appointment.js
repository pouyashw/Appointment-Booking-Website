const yup = require("yup");

const createAppointmentValidator = yup.object({
    barber: yup
        .string()
        .required("barber is required"),

    service: yup
        .string()
        .required("service is required"),

    date: yup
        .string()
        .required("date is required"),

    time: yup
        .string()
        .required("time is required"),

    status: yup
        .string()
        .oneOf(
            ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
            "status is not valid"
        )
        .default("PENDING")
});

module.exports = {
    createAppointmentValidator
};