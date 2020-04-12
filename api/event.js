const firebase = require("firebase/app");
const util = require("~/plugins/util").util;
const schema = require("~/schema").default;

module.exports = function (Api) {
  Api.prototype.addEvent = async function (event) {
    event.Created = this.now();
    await this.$fireStore.collection("Event").add(event);
  };
  Api.prototype.getEvent = async function (id) {
    try {
      const snapshot = await this.$fireStore.doc("Event/" + id).get();
      const result = _.cloneDeep(snapshot.data());
      result.Id = id;
      result.Options.StartAt = util.parseFirebaseTimestamp(result.Options.StartAt);
      result.Options.RsvpOpen = util.parseFirebaseTimestamp(result.Options.RsvpOpen);
      result.Options.RsvpClose = util.parseFirebaseTimestamp(result.Options.RsvpClose);
      result.Created = util.parseFirebaseTimestamp(result.Created);
      return result;
    } catch {
      return schema.kNullEvent;
    }
  };
  Api.prototype.searchEvent = async function (
    type, groupId, userId, begin, end) {
    try {
      let query = this.$fireStore.collection("Event");
      if (type) {
        query = query.where("Type", "==", type);
      }
      if (groupId) {
        query = query.where("GroupId", "==", groupId);
      }
      if (userId) {
        query = query.where("UserId", "==", userId);
      }
      if (end.getTime() !== 0) {
        query = query.where("Options.StartAt", "<=", firebase.firestore.Timestamp.fromDate(end));
      }
      if (begin.getTime() !== 0) {
        query = query.where("Options.StartAt", ">=", firebase.firestore.Timestamp.fromDate(begin));
      }
      const snapshot = await query.get();
      const result = [];
      snapshot.docs.forEach((doc) => {
        const st = _.cloneDeep(doc.data());
        st.Id = doc.id;
        st.Options.StartAt = util.parseFirebaseTimestamp(st.Options.StartAt);
        st.Options.RsvpOpen = util.parseFirebaseTimestamp(st.Options.RsvpOpen);
        st.Options.RsvpClose = util.parseFirebaseTimestamp(st.Options.RsvpClose);
        st.Created = util.parseFirebaseTimestamp(st.Created);
        result.push(st);
      });
      return result;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
  Api.prototype.delEvent = async function (eid) {
    const collection = this.$fireStore.collection("Event/" + eid + "/Record/");
    const snapshot = await collection.get();
    for (let i = 0; i < snapshot.docs.length; i++) {
      await snapshot.docs[i].delete();
    }
    await this.$fireStore.doc("Event/" + eid).delete();
  };
};
