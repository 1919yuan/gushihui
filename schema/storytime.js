import { kNullEvent } from "./event";
import { kNullRecord } from "./record";

export const kNullStorytimeE = {
  BookIds: [],
  Themes: [],
  AgeRange: ""
};

const _NullStorytimeEvent = _.cloneDeep(kNullEvent);
_NullStorytimeEvent.Type = "storytime";
_NullStorytimeEvent.Storytime = kNullStorytimeE;
_NullStorytimeEvent.Options.CategoryNames = ["大人/Adult", "小孩/Child"];
_NullStorytimeEvent.Options.Categorize = true;
_NullStorytimeEvent.Options.Limits = [0, 0];
_NullStorytimeEvent.Options.Required = [true, true];
_NullStorytimeEvent.Options.Quotas = [5, 5];
_NullStorytimeEvent.Options.Quota = 5;
export const kNullStorytimeEvent = _NullStorytimeEvent;

export const kNullStorytimeR = {
  Names: []
};

const _NullStorytimeRecord = _.cloneDeep(kNullRecord);
_NullStorytimeRecord.Type = "storytime";
_NullStorytimeRecord.Storytime = kNullStorytimeR;

export const kNullStorytimeRecord = _NullStorytimeRecord;
