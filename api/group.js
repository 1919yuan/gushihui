const firebase = require("firebase/app");
const schema = require("~/schema").default;

async function _canonicalizeGroup (group, api) {
  for (let i = 0; i < group.Owners.length; i++) {
    const result = await api.searchUser(group.Owners[i]);
    if (result === schema.kNullUser) {
      throw new Error("Owner not found: " + group.Owners[i]);
    }
    group.Owners[i] = result.Id;
  }
  for (let i = 0; i < group.Managers.length; i++) {
    const result = await api.searchUser(group.Managers[i]);
    if (result === schema.kNullUser) {
      throw new Error("Manager not found: " + group.Managers[i]);
    }
    group.Managers[i] = result.Id;
  }
  for (let i = 0; i < group.Members.length; i++) {
    const result = await api.searchUser(group.Members[i]);
    if (result === schema.kNullUser) {
      throw new Error("Manager not found: " + group.Members[i]);
    }
    group.Members[i] = result.Id;
  }
  return group;
};

async function _canonicalizeGroupWithUsernames (group, api) {
  for (let i = 0; i < group.Owners.length; i++) {
    const result = await api.getUser(group.Owners[i]);
    if (result === schema.kNullUser) {
      throw new Error("Owner not found: " + group.Owners[i]);
    }
    group.Owners[i] = result.Username;
  }
  for (let i = 0; i < group.Managers.length; i++) {
    const result = await api.getUser(group.Managers[i]);
    if (result === schema.kNullUser) {
      throw new Error("Manager not found: " + group.Managers[i]);
    }
    group.Managers[i] = result.Username;
  }
  for (let i = 0; i < group.Members.length; i++) {
    const result = await api.getUser(group.Members[i]);
    if (result === schema.kNullUser) {
      throw new Error("Manager not found: " + group.Members[i]);
    }
    group.Members[i] = result.Username;
  }
  return group;
};

async function _canonicalizeGroupWithEmails (group, api) {
  for (let i = 0; i < group.Owners.length; i++) {
    const result = await api.getUser(group.Owners[i]);
    if (result === schema.kNullUser) {
      throw new Error("Owner not found: " + group.Owners[i]);
    }
    group.Owners[i] = result.Uid;
  }
  for (let i = 0; i < group.Managers.length; i++) {
    const result = await api.getUser(group.Managers[i]);
    if (result === schema.kNullUser) {
      throw new Error("Manager not found: " + group.Managers[i]);
    }
    group.Managers[i] = result.Uid;
  }
  for (let i = 0; i < group.Members.length; i++) {
    const result = await api.getUser(group.Members[i]);
    if (result === schema.kNullUser) {
      throw new Error("Manager not found: " + group.Members[i]);
    }
    group.Members[i] = result.Uid;
  }
  return group;
};

module.exports = function (Api) {
  Api.prototype.createGroup = async function (group) {
    if (group.Id === "") {
      throw new Error("You must provide a group id.");
    }
    if (!this.$store.getters["account/isLoggedIn"]) {
      throw new Error("You must login.");
    }
    group = await _canonicalizeGroup(group, this);
    group.Created = this.now();
    if (!group.Owners.includes(this.$store.state.account.authUser.Id)) {
      throw new Error("You must be one of the Owners to setGroup.");
    }
    await this.$fireStore.doc("Group/" + group.Id).set(group);
    for (let i = 0; i < group.Owners.length; i++) {
      const userDoc = this.$fireStore.doc("User/" + group.Owners[i]);
      await userDoc.update({
        OwnerGroups: firebase.firestore.FieldValue.arrayUnion(group.Id)
      });
    }
    for (let i = 0; i < group.Managers.length; i++) {
      const userDoc = this.$fireStore.doc("User/" + group.Managers[i]);
      await userDoc.update({
        ManagerGroups: firebase.firestore.FieldValue.arrayUnion(group.Id)
      });
    }
    for (let i = 0; i < group.Members.length; i++) {
      const userDoc = this.$fireStore.doc("User/" + group.Members[i]);
      await userDoc.update({
        MemberGroups: firebase.firestore.FieldValue.arrayUnion(group.Id)
      });
    }
  };
  Api.prototype.updateGroupMetadata = async function (metadata, id) {
    const groupDoc = this.$fireStore.doc("Group/" + id);
    await groupDoc.update({
      Title: metadata.Title,
      Description: metadata.Description,
      ThumbnailUrl: metadata.ThumbnailUrl
    });
  };
  Api.prototype.getGroup = async function (id) {
    if (!id) { return schema.kNullGroup; }
    try {
      const snapshot = await this.$fireStore.doc("Group/" + id).get();
      const result = snapshot.data();
      result.Id = id;
      return result;
    } catch {
      return schema.kNullGroup;
    }
  };
  Api.prototype.getGroupOfUsernames = async function (group) {
    try {
      const canonicalized = await _canonicalizeGroupWithUsernames(
        _.cloneDeep(group), this);
      return canonicalized;
    } catch {
      return schema.kNullGroup;
    }
  };
  Api.prototype.getGroupOfEmails = async function (group) {
    try {
      const canonicalized = await _canonicalizeGroupWithEmails(
        _.cloneDeep(group), this);
      return canonicalized;
    } catch {
      return schema.kNullGroup;
    }
  };
  Api.prototype.addMember = async function (member, groupId) {
    const user = await this.searchUser(member);
    if (user === schema.kNullUser) {
      throw new Error("User not found.");
    }
    const group = await this.getGroup(groupId);
    if (group === schema.kNullGroup) {
      throw new Error("Group not found.");
    }
    await this.addMemberId(user.Id, group.Id);
  };
  Api.prototype.addMemberId = async function (userId, groupId) {
    const groupDoc = this.$fireStore.doc("Group/" + groupId);
    const userDoc = this.$fireStore.doc("User/" + userId);
    await groupDoc.update({
      Members: firebase.firestore.FieldValue.arrayUnion(userId)
    });
    await userDoc.update({
      MemberGroups: firebase.firestore.FieldValue.arrayUnion(groupId)
    });
  };
  Api.prototype.addOwner = async function (owner, groupId) {
    const user = await this.searchUser(owner);
    if (user === schema.kNullUser) {
      throw new Error("User not found.");
    }
    const group = await this.getGroup(groupId);
    if (group === schema.kNullGroup) {
      throw new Error("Group not found.");
    }
    await this.addOwnerId(user.Id, group.Id);
  };
  Api.prototype.addOwnerId = async function (userId, groupId) {
    const groupDoc = this.$fireStore.doc("Group/" + groupId);
    const userDoc = this.$fireStore.doc("User/" + userId);
    await groupDoc.update({
      Owners: firebase.firestore.FieldValue.arrayUnion(userId)
    });
    await userDoc.update({
      OwnerGroups: firebase.firestore.FieldValue.arrayUnion(groupId)
    });
  };
  Api.prototype.addManager = async function (manager, groupId) {
    const user = await this.searchUser(manager);
    if (user === schema.kNullUser) {
      throw new Error("User not found.");
    }
    const group = await this.getGroup(groupId);
    if (group === schema.kNullGroup) {
      throw new Error("Group not found.");
    }
    await this.addManagerId(user.Id, group.Id);
  };
  Api.prototype.addManagerId = async function (userId, groupId) {
    const groupDoc = this.$fireStore.doc("Group/" + groupId);
    const userDoc = this.$fireStore.doc("User/" + userId);
    await groupDoc.update({
      Managers: firebase.firestore.FieldValue.arrayUnion(userId)
    });
    await userDoc.update({
      ManagerGroups: firebase.firestore.FieldValue.arrayUnion(groupId)
    });
  };
  Api.prototype.removeMemberId = async function (userId, groupId) {
    const groupDoc = this.$fireStore.doc("Group/" + groupId);
    const userDoc = this.$fireStore.doc("User/" + userId);
    await groupDoc.update({
      Members: firebase.firestore.FieldValue.arrayRemove(userId)
    });
    await userDoc.update({
      MemberGroups: firebase.firestore.FieldValue.arrayRemove(groupId)
    });
  };
  Api.prototype.removeManagerId = async function (userId, groupId) {
    const groupDoc = this.$fireStore.doc("Group/" + groupId);
    const userDoc = this.$fireStore.doc("User/" + userId);
    await groupDoc.update({
      Managers: firebase.firestore.FieldValue.arrayRemove(userId)
    });
    await userDoc.update({
      ManagerGroups: firebase.firestore.FieldValue.arrayRemove(groupId)
    });
  };
  Api.prototype.removeOwnerId = async function (userId, groupId) {
    const groupDoc = this.$fireStore.doc("Group/" + groupId);
    const userDoc = this.$fireStore.doc("User/" + userId);
    await groupDoc.update({
      Owners: firebase.firestore.FieldValue.arrayRemove(userId)
    });
    await userDoc.update({
      OwnerGroups: firebase.firestore.FieldValue.arrayRemove(groupId)
    });
  };
  Api.prototype.listGroups = async function () {
    const snapshot = await this.$fireStore.collection("Group").get();
    const groups = [];
    snapshot.docs.forEach((doc) => {
      const group = doc.data();
      group.Id = doc.id;
      groups.push(group);
    });
    return groups;
  };
  Api.prototype.getMyManagingGroups = async function () {
    const result = [];
    const authUser = this.$store.state.account.authUser;
    let i = 0;
    if (authUser.OwnerGroups) {
      for (i = 0; i < authUser.OwnerGroups.length; i++) {
        const g = authUser.OwnerGroups[i];
        const gdata = await this.$fireStore.doc("Group/" + g).get();
        result.push(gdata.data());
      }
    }
    if (authUser.ManagerGroups) {
      for (i = 0; i < authUser.ManagerGroups.length; i++) {
        const g = authUser.ManagerGroups[i];
        const gdata = await this.$fireStore.doc("Group/" + g).get();
        result.push(gdata.data());
      }
    }
    return result;
  };
};
