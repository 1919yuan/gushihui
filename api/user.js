const schema = require("~/schema").default;

module.exports = function (Api) {
  Api.prototype.addUser = async function (user) {
    user.Created = this.now();
    await this.$fireStore.collection("User").add(user);
  };
  Api.prototype.setUser = async function (user) {
    if (user.Id === "") {
      throw new Error("You must provide a user id.");
    } else {
      const userId = user.Id;
      user.Id = null;
      await this.$fireStore.doc("User/" + userId).set(user);
    }
  };
  Api.prototype.getUser = async function (id) {
    if (!id) { return schema.kNullUser; }
    try {
      const snapshot = await this.$fireStore.doc("User/" + id).get();
      const result = snapshot.data();
      result.Id = id;
      return result;
    } catch {
      return schema.kNullUser;
    }
  };
  Api.prototype.searchUser = async function (emailOrUsername) {
    const result = await this.getUserWithEmail(emailOrUsername);
    if (result !== schema.kNullUser) {
      return result;
    } else {
      const result = await this.getUserWithUsername(emailOrUsername);
      return result;
    }
  };
  Api.prototype.getUserWithEmail = async function (email) {
    const users = this.$fireStore.collection("User");
    const query = users.where("Uid", "==", email);
    const snapshot = await query.get();
    if (snapshot.docs.length > 0) {
      const result = snapshot.docs[0].data();
      result.Id = snapshot.docs[0].id;
      return result;
    } else {
      return schema.kNullUser;
    }
  };
  Api.prototype.getUserWithUsername = async function (username) {
    const users = this.$fireStore.collection("User");
    const query = users.where("Username", "==", username);
    const snapshot = await query.get();
    if (snapshot.docs.length > 0) {
      const result = snapshot.docs[0].data();
      result.Id = snapshot.docs[0].id;
      return result;
    } else {
      return schema.kNullUser;
    }
  };
};
