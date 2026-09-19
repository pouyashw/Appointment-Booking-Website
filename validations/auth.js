const yup = require("yup");

const sentOtpValidator = yup.object({
  phone: yup
    .string()
    .required("شماره تلفن الزامی است")
    .matches(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "شماره تلفن معتبر نیست"
    ),
});

const otpVerifyValidator = yup.object({
  phone: yup
    .string()
    .required("شماره تلفن الزامی است")
    .matches(
      /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
      "شماره تلفن معتبر نیست"
    ),

  otp: yup
    .string()
    .required("کد الزامی است")
    .matches(/^[0-9]+$/, "کد معتبر نیست")
});

module.exports = { sentOtpValidator, otpVerifyValidator };
