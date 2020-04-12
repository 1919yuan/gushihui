import Vue from "vue";
import { ValidationObserver, ValidationProvider, extend, configure } from "vee-validate";
import { digits, min, max, numeric, required, email, confirmed } from "vee-validate/dist/rules";
import { translate } from "~/plugins/i18n.js";

const _isValidIsbn = (str) => {
  let sum, weight, digit, check, i;

  str = str.replace(/[^0-9X]/gi, "");

  if (str.length !== 10 && str.length !== 13) {
    return false;
  }

  if (str.length === 13) {
    sum = 0;
    for (i = 0; i < 12; i++) {
      digit = parseInt(str[i]);
      if (i % 2 === 1) {
        sum += 3 * digit;
      } else {
        sum += digit;
      }
    }
    check = (10 - (sum % 10)) % 10;
    return check === str[str.length - 1];
  }

  if (str.length === 10) {
    weight = 10;
    sum = 0;
    for (i = 0; i < 9; i++) {
      digit = parseInt(str[i]);
      sum += weight * digit;
      weight--;
    }
    check = 11 - (sum % 11);
    if (check === 10) {
      check = "X";
    }
    return check === str[str.length - 1].toUpperCase();
  }
};

extend("required", required);
extend("min", min);
extend("max", max);
extend("email", email);
extend("confirmed", confirmed);
extend("digits", digits);
extend("numeric", numeric);
extend("isbn", {
  message: (_, values) => translate.t(
    "book.validate_isbn", { isbn: values._value_ }),
  validate: _isValidIsbn
});
extend("password", {
  message: (_, _values) => translate.t("vee.password"),
  validate: (value) => {
    const strongRegex = new RegExp("^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[!@#$%^&*])");
    return strongRegex.test(value);
  }
});
extend("username", {
  message: (_, _values) => translate.t("vee.username"),
  validate: (value) => {
    const strongRegex = new RegExp("^[a-z0-9]{6,}$");
    return strongRegex.test(value);
  }
});
extend("groupname", {
  message: (_, _values) => translate.t("vee.groupname"),
  validate: (value) => {
    const strongRegex = new RegExp("^[a-z0-9-]{3,}$");
    return strongRegex.test(value);
  }
});
extend("email_or_username", {
  message: (_, _values) => translate.t("vee.email_or_username"),
  validate: (value) => {
    const eouRegex = new RegExp(
      "^(([A-Za-z0-9_.-]+)@([A-Za-z0-9_.-]+).([A-Za-z]{2,5})|[a-z0-9]{6,})$");
    return eouRegex.test(value);
  }
});

extend("url", {
  message: (_, _values) => translate.t("vee.url"),
  validate: (value) => {
    const urlRegex = new RegExp(
      "^https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{1,256}.[a-zA-Z0-9()]{1,6}([-a-zA-Z0-9()@:%_+.~#?&//=]*)$");
    return urlRegex.test(value);
  }
});

configure({
  defaultMessage: (_, values) => translate.t(`validations.${values._rule_}`,
    values)
});

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
