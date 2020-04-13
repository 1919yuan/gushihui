module.exports = function (Api) {
  Api.prototype.saveVenue = async function (venue) {
    venue.Created = this.now();
    await this.$fireStore.collection("Venue").add(venue);
  };
  Api.prototype.getPrefilledVenues = async function (groupId) {
    const venues = this.$fireStore.collection("Venue");
    const result = [];
    if (groupId) {
      const groupQuery = venues.where("GroupId", "==", groupId);
      const snapshot1 = await groupQuery.get();
      snapshot1.docs.forEach((doc) => {
        const r = doc.data();
        r.Id = doc.id;
        result.push(r);
      });
    }
    const userQuery = venues.where("UserId", "==", this.$store.state.account.authUser.Id);
    const snapshot2 = await userQuery.get();
    snapshot2.docs.forEach((doc) => {
      const r = doc.data();
      r.Id = doc.id;
      result.push(r);
    });
    return result;
  };
  Api.prototype.saveOnlineVenue = async function (venue) {
    venue.Created = this.now();
    await this.$fireStore.collection("OnlineVenue").add(venue);
  };
  Api.prototype.getPrefilledOnlineVenues = async function (groupId) {
    const venues = this.$fireStore.collection("OnlineVenue");
    const result = [];
    if (groupId) {
      const groupQuery = venues.where("GroupId", "==", groupId);
      const snapshot1 = await groupQuery.get();
      snapshot1.docs.forEach((doc) => {
        const r = doc.data();
        r.Id = doc.id;
        result.push(r);
      });
    }
    const userQuery = venues.where("UserId", "==", this.$store.state.account.authUser.Id);
    const snapshot2 = await userQuery.get();
    snapshot2.docs.forEach((doc) => {
      const r = doc.data();
      r.Id = doc.id;
      result.push(r);
    });
    return result;
  };
};
