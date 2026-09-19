const yup = require('yup')

exports.profileValidation = yup.object({
    username: yup
        .string()
        .required("تام کاربری الزامی است")
        .min(3, "نام کاربری نباید از 3 کارکتر کمتر باشد"),
})