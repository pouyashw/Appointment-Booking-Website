const yup = require("yup");

exports.createServiceValidator = yup.object({
    title: yup
        .string()
        .required("عنوان سرویس الزامی است")
        .min(2, "عنوان سرویس حداقل باید 2 کاراکتر باشد")
        .max(50, "عنوان سرویس نباید بیشتر از 50 کاراکتر باشد"),

    description: yup
        .string()
        .max(500, "توضیحات نباید بیشتر از 500 کاراکتر باشد"),

    price: yup
        .number()
        .typeError("قیمت باید عدد باشد")
        .required("قیمت الزامی است")
        .min(0, "قیمت نمی‌تواند منفی باشد"),

    duration: yup
        .number()
        .typeError("مدت زمان باید عدد باشد")
        .required("مدت زمان الزامی است")
        .min(5, "حداقل زمان سرویس 5 دقیقه است")
        .max(600, "حداکثر زمان سرویس 600 دقیقه است"),

    isActive: yup
        .boolean()
});

exports.updateServiceValidator = yup.object({
    title: yup
        .string()
        .min(2, "عنوان سرویس حداقل باید 2 کاراکتر باشد")
        .max(50, "عنوان سرویس نباید بیشتر از 50 کاراکتر باشد"),

    description: yup
        .string()
        .max(500, "توضیحات نباید بیشتر از 500 کاراکتر باشد"),

    price: yup
        .number()
        .typeError("قیمت باید عدد باشد")
        .min(0, "قیمت نمی‌تواند منفی باشد"),

    duration: yup
        .number()
        .typeError("مدت زمان باید عدد باشد")
        .min(5, "حداقل زمان سرویس 5 دقیقه است")
        .max(600, "حداکثر زمان سرویس 600 دقیقه است"),

    isActive: yup
        .boolean()
});