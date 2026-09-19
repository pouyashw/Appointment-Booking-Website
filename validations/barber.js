const yup = require("yup");

exports.createBarberValidator = yup.object({
    user: yup
        .string()
        .required("کاربر الزامی است"),

    services: yup
        .array()
        .of(yup.string())
        .min(1, "حداقل یک سرویس انتخاب کنید"),

    workDays: yup
        .array()
        .of(yup.string())
        .min(1, "حداقل یک روز کاری انتخاب کنید")
        .required(),

    startTime: yup
        .string()
        .required("ساعت شروع الزامی است"),

    endTime: yup
        .string()
        .required("ساعت پایان الزامی است"),

    bio: yup
        .string()
        .max(500, "بیوگرافی بیش از حد طولانی است"),

    avatar: yup
        .string()
        .nullable()
});

exports.editBarberProfileValidator = yup.object({

    bio: yup
        .string()
        .max(
            500,
            "بیوگرافی نمی‌تواند بیشتر از 500 کاراکتر باشد"
        ),

    avatar: yup
        .string(),

    workDays: yup
        .array()
        .of(
            yup.string().oneOf([
                "شنبه",
                "یکشنبه",
                "دوشنبه",
                "سه‌شنبه",
                "چهارشنبه",
                "پنجشنبه",
                "جمعه"
            ])
        ),

    startTime: yup
        .string()
        .matches(
            /^([01]\d|2[0-3]):([0-5]\d)$/,
            "فرمت ساعت شروع نامعتبر است"
        ),

    endTime: yup
        .string()
        .matches(
            /^([01]\d|2[0-3]):([0-5]\d)$/,
            "فرمت ساعت پایان نامعتبر است"
        )

});

exports.editBarberProfileValidatorForAdmin = yup.object({
    services: yup
        .array()
        .of(yup.string())
        .min(1, "حداقل یک سرویس انتخاب کنید"),

    bio: yup
        .string()
        .max(
            500,
            "بیوگرافی نمی‌تواند بیشتر از 500 کاراکتر باشد"
        ),

    avatar: yup
        .string(),

    workDays: yup
        .array()
        .of(
            yup.string().oneOf([
                "شنبه",
                "یکشنبه",
                "دوشنبه",
                "سه‌شنبه",
                "چهارشنبه",
                "پنجشنبه",
                "جمعه"
            ])
        ),

    startTime: yup
        .string()
        .matches(
            /^([01]\d|2[0-3]):([0-5]\d)$/,
            "فرمت ساعت شروع نامعتبر است"
        ),

    endTime: yup
        .string()
        .matches(
            /^([01]\d|2[0-3]):([0-5]\d)$/,
            "فرمت ساعت پایان نامعتبر است"
        )

});