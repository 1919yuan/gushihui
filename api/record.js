const firebase = require("firebase/app");
const util = require("~/plugins/util").util;
const schema = require("~/schema").default;

module.exports = function (Api) {
  Api.prototype.getRecord = async function (eid, id) {
    try {
      const snapshot = await this.$fireStore.doc("Event/" + eid + "/Record/" + id).get();
      const result = _.cloneDeep(snapshot.data());
      result.Id = id;
      result.Created = util.parseFirebaseTimestamp(result.Created);
      return result;
    } catch {
      return schema.kNullRecord;
    }
  };
  Api.prototype.searchRecord = async function (
    type, userId, eventId, eventGroupId, eventUserId, begin, end) {
    let query = this.$fireStore.collectionGroup("Record");
    if (type) {
      query = query.where("Type", "==", type);
    }
    if (userId) {
      query = query.where("UserId", "==", userId);
    }
    if (eventId) {
      query = query.where("EventId", "==", eventId);
    }
    if (eventGroupId) {
      query = query.where("EventGroupId", "==", eventGroupId);
    }
    if (eventUserId) {
      query = query.where("EventUserId", "==", eventUserId);
    }
    if (begin.getTime() !== 0) {
      query = query.where("Created", ">=", firebase.firestore.Timestamp.fromDate(begin));
    }
    if (end.getTime() !== 0) {
      query = query.where("Created", "<=", firebase.firestore.Timestamp.fromDate(end));
    }
    const snapshot = await query.get();
    const result = [];
    snapshot.docs.forEach((doc) => {
      const rec = _.cloneDeep(doc.data());
      rec.Id = doc.id;
      rec.Created = util.parseFirebaseTimestamp(rec.Created);
      result.push(rec);
    });
    return result;
  };
  Api.prototype.addRecord = async function (record) {
    const event = await this.getEvent(record.EventId);
    let allowed = true;
    let reason = "";
    if (event.Options.IsCountsLimited) {
      for (let i = 0; i < event.Options.CategoryNames.length; i++) {
        if (event.Options.Limits[i] > 0) {
          if (event.Options.Remaining[i] < record.Counts[i]) {
            allowed = false;
            reason = "rsvp/percat_remaining";
            break;
          }
        }
      }
      if (!allowed) {
        throw new Error(reason);
      }
    }
    if (event.Options.Categorize) {
      for (let i = 0; i < event.Options.CategoryNames.length; i++) {
        if (record.Counts[i] === 0 && event.Options.Required[i]) {
          allowed = false;
          reason = "rsvp/required_cat";
          break;
        }
      }
      if (!allowed) {
        throw new Error(reason);
      }
    }
    if (event.Options.IsTotalCountLimited) {
      if (event.Options.TotalLimit > 0) {
        if (event.Stats.TotalRemaining < record.Count) {
          allowed = false;
          reason = "rsvp/total_remaining";
        }
      }
    }
    if (!allowed) {
      throw new Error(reason);
    }
    // Now cut the counts.
    if (event.Options.Categorize) {
      for (let i = 0; i < event.Options.CategoryNames.length; i++) {
        event.Stats.Counts[i] += record.Counts[i];
        event.Stats.TotalCount += record.Counts[i];
        if (event.Options.IsCountsLimited) {
          if (event.Options.Limits[i] > 0) {
            event.Stats.Remaining[i] -= record.Counts[i];
          }
        }
        if (event.Options.IsTotalCountLimited) {
          event.Stats.TotalRemaining -= record.Counts[i];
        }
      }
    } else {
      event.Stats.TotalCount += record.Count;
      if (event.Options.IsTotalCountLimited) {
        event.Stats.TotalRemaining -= record.Count;
      }
    }
    record.Created = this.now();
    await this.$fireStore.collection("Event/" + record.EventId + "/Record").add(record);
    await this.$fireStore.doc("Event/" + record.EventId).set(event);
  };
  Api.prototype.delRecord = async function (eid, id) {
    const event = await this.getEvent(eid);
    const record = await this.getRecord(eid, id);
    if (event.Options.Categorize) {
      for (let i = 0; i < record.Counts.length; i++) {
        if (event.Options.IsTotalCountLimited) {
          event.Stats.TotalRemaining += record.Counts[i];
        }
        if (event.Options.IsCountsLimited) {
          event.Stats.Remaining[i] += record.Counts[i];
        }
        event.Stats.Counts[i] -= record.Counts[i];
        event.Stats.TotalCount -= record.Counts[i];
      }
    } else {
      if (event.Options.IsTotalCountLimited) {
        event.Stats.TotalRemaining += record.Count;
      }
      event.Stats.TotalCount -= record.Count;
    }
    await this.$fireStore.doc("Event/" + eid).set(event);
    await this.$fireStore.doc("Event/" + eid + "/Record/" + id).delete();
  };
};
