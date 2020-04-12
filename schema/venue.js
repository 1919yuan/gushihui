import { kNullAddress } from "~/schema/address";
import { kNullPhone } from "~/schema/phone";

export const kNullVenue = {
  EditorId: "",
  UserId: "",
  GroupId: "",
  Name: "",
  Address: kNullAddress,
  Phone: kNullPhone,
  Capacity: 0,
  Url: "",
  Description: ""
};

export const kNullOnlineVenue = {
  EditorId: "",
  UserId: "",
  GroupId: "",
  Name: "",
  Type: "",
  Capacity: 0,
  Zoom: null,
  Hangout: null,
  Skype: null,
  Youtube: null
};

export const kOnlineVenueTypes = {
  hangout: "Hangout",
  zoom: "Zoom",
  skype: "Skype",
  youtube: "Youtube"
};

export const kOnlineVenueTypeValues = Object.values(kOnlineVenueTypes);
