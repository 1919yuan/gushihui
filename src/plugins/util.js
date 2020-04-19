import csc from "country-state-city";
import { translate } from "~/plugins/i18n";
const firebase = require("firebase/app");

class Util {
  parseLocalDate (s) {
    const ds = s.split(/\D/).map(s => parseInt(s));
    if (ds.length <= 1) {
      ds.push(1);
    }
    if (ds.length <= 2) {
      ds.push(1);
    }
    ds[1] = ds[1] - 1; // adjust month
    return new Date(...ds);
  }

  parseFirebaseTimestamp (ts) {
    const timestamp = new firebase.firestore.Timestamp(
      ts.seconds,
      ts.nanoseconds
    );
    return timestamp.toDate();
  }

  formatLocalTime (d) {
    const ampm = d.getHours() >= 12 ? "PM" : "AM";
    const datestring =
        ("0" + (d.getMonth() + 1)).slice(-2) +
        "/" +
        ("0" + d.getDate()).slice(-2) +
        " " +
        ("0" + d.getHours()).slice(-2) +
        ":" +
        ("0" + d.getMinutes()).slice(-2) +
        " " +
        ampm;
    return datestring;
  }

  formatLocalDate (d) {
    const datestring =
      d.getFullYear() +
      "-" +
      ("0" + (d.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + d.getDate()).slice(-2);
    return datestring;
  }

  formatUTCTime (d) {
    return d.toISOString();
  }

  formatUTCTimeCalendar (d) {
    return d.getUTCFullYear() + ("0" + (d.getUTCMonth() + 1)).slice(-2) + ("0" + d.getUTCDate()).slice(-2) + "T" + ("0" + d.getUTCHours()).slice(-2) + ("0" + d.getUTCMinutes()).slice(-2) + ("0" + d.getUTCSeconds()).slice(-2) + "Z";
  }

  parseUTCTime (s) {
    return new Date(s);
  }

  daysOut (d, days) {
    const newd = new Date(d);
    newd.setDate(d.getDate() + days);
    return newd;
  }

  twoWeeksOut (d) {
    return this.daysOut(d, 14);
  }

  birthdayToAge (d) {
    const today = new Date();
    let age = today.getFullYear() - d.getFullYear();
    const m = today.getMonth() - d.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < d.getDate())) {
      age--;
    }
    return age;
  }

  // arrayEqual(a, b) {
  //   if (!a && !b) return true;
  //   if ((!a && b) || (!b && a)) return false;
  //   return (
  //     a.length == b.length &&
  //     a.every((element, idx) => {
  //       return element === b[idx];
  //     })
  //   );
  // }
  formatAddress (address) {
    let ret = "";
    if (address.Name) {
      ret += address.Name;
    }
    if (address.Line1) {
      if (ret) {
        ret += ", ";
      }
      ret += address.Line1;
    }
    if (address.Line2) {
      if (ret) {
        ret += ", ";
      }
      ret += address.Line2;
    }
    if (address.City) {
      if (ret) {
        ret += ", ";
      }
      ret += address.City;
    }
    if (address.State) {
      if (ret) {
        ret += ", ";
      }
      ret += address.State;
    }
    if (address.ZipCode) {
      if (ret) {
        ret += " ";
      }
      ret += address.ZipCode;
    }
    if (address.Country) {
      if (ret) {
        ret += ", ";
      }
      ret += address.Country;
    }
    return ret;
  }

  formatPhone (phone) {
    if (phone.CountryCode === "1") {
      return "(" + phone.AreaCode + ") " + phone.Number.slice(0, 3) + "-" + phone.Number.slice(3);
    } else {
      return "+" + phone.CountryCode + "-" + phone.AreaCode + "-" + phone.Number;
    }
  }

  sleep (milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }

  firebaseError (code) {
    if (code in translate.messages[translate.locale].firebase) {
      return translate.t("firebase." + code);
    } else {
      return translate.t("firebase.auth/other-error");
    }
  }

  getMatchingCountry (data) {
    for (const c of csc.getAllCountries()) {
      if (c.name === data.Country) {
        return c;
      }
    }
    return csc.getCountryByCode("US");
  }

  getMatchingState (data, country) {
    for (const s of csc.getStatesOfCountry(country.id)) {
      if (s.name === data.State) {
        return s;
      }
    }
    return null;
  }

  getMatchingCity (data, state) {
    for (const c of csc.getCitiesOfState(state.id)) {
      if (c.name === data.City) {
        return c;
      }
    }
    return null;
  }

  getOnlineVenueUrl (v) {
    if (v.Type === "Zoom") {
      return v.Zoom.JoinUrl;
    } else if (v.Type === "Hangout") {
      return v.Hangout.JoinUrl;
    } else if (v.Type === "Skype") {
      return v.Skype.JoinUrl;
    } else if (v.Type === "Youtube") {
      return v.Youtube.JoinUrl;
    }
    return "";
  }

  getExcerpt (html) {
    const cheerio = require("cheerio");
    const cheerioStatic = cheerio.load(html || "");
    return cheerioStatic("html *").contents().toArray()
      .map(element => element.type === "text" ? cheerioStatic(element).text().trim() : null)
      .filter(text => text)
      .join(" ").slice(0, 400) + "...";
  }
}

export const util = new Util();

export default ({ app }, inject) => {
  inject("util", util);
};
