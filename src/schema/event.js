export const kNullOptions = {
  Name: "",
  Categorize: false,
  CategoryNames: [],
  IsFree: true,
  Fees: [],
  IsCountsLimited: false,
  Limits: [],
  Quotas: [],
  Required: [],
  IsTotalCountLimited: false,
  TotalLimit: 0,
  Quota: 5,
  RsvpOpen: new Date(0),
  RsvpClose: new Date(0),
  StartAt: new Date(0),
  Duration: 30,
  RequireLogin: true
};

export const kNullStats = {
  Counts: [],
  TotalCount: 0,
  Remaining: [],
  TotalRemaining: 0,
  Viewed: 0
};

export const kNullEvent = {
  EditorId: "",
  UserId: "",
  GroupId: "",
  Name: "",
  Venues: [],
  OnlineVenues: [],
  Agenda: "",
  Options: kNullOptions,
  Stats: kNullStats,
  Type: "",
  Storytime: null,
  Gala: null,
  Class: null
};
