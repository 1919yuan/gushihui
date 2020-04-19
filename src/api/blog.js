const firebase = require("firebase/app");
const util = require("~/plugins/util").util;
const schema = require("~/schema").default;

module.exports = function (Api) {
  Api.prototype.getBlog = async function (id) {
    try {
      const snapshot = await this.$fireStore.doc("Blog/" + id).get();
      const result = _.cloneDeep(snapshot.data());
      result.Id = id;
      result.Created = util.parseFirebaseTimestamp(result.Created);
      result.Updated = util.parseFirebaseTimestamp(result.Updated);
      return result;
    } catch {
      return schema.kNullBlog;
    }
  };
  Api.prototype.searchBlog = async function (
    groupId, userId, path, begin, end, includeHidden) {
    let query = this.$fireStore.collection("Blog");
    if (userId) {
      query = query.where("UserId", "==", userId);
    }
    if (groupId) {
      query = query.where("GroupId", "==", groupId);
    }
    if (path) {
      query = query.where("Path", "==", path);
    }
    if (begin.getTime() !== 0) {
      query = query.where("Created", ">=", firebase.firestore.Timestamp.fromDate(begin));
    }
    if (end.getTime() !== 0) {
      query = query.where("Created", "<=", firebase.firestore.Timestamp.fromDate(end));
    }
    if (!includeHidden) {
      query = query.where("Searchable", "==", true);
    }
    const snapshot = await query.get();
    const result = [];
    snapshot.docs.forEach((doc) => {
      const rec = _.cloneDeep(doc.data());
      rec.Id = doc.id;
      rec.Created = util.parseFirebaseTimestamp(rec.Created);
      rec.Updated = util.parseFirebaseTimestamp(rec.Updated);
      result.push(rec);
    });
    return result;
  };
  Api.prototype.addBlog = async function (blog) {
    const existingBlogs = await this.searchBlog(
      blog.GroupId, blog.UserId, blog.Path, new Date(0), new Date(0));
    if (existingBlogs.length !== 0) {
      throw new Error("Failed to create blog: duplicate static path exists.");
    }
    blog.Created = this.now();
    blog.Updated = blog.Created;
    await this.$fireStore.collection("Blog").add(blog);
  };
  Api.prototype.setBlog = async function (blog, oldBlog) {
    if (oldBlog && blog.Path !== oldBlog.Path) {
      const existingBlogs = await this.searchBlog(
        blog.GroupId, blog.UserId, blog.Path, new Date(0), new Date(0));
      if (existingBlogs.length !== 0) {
        throw new Error("Failed to update blog: duplicate static path exists.");
      }
    }
    blog.Updated = this.now();
    await this.$fireStore.doc("Blog/" + blog.Id).set(blog);
  };
  Api.prototype.delBlog = async function (id) {
    await this.$fireStore.doc("Blog/" + id).delete();
  };
};
