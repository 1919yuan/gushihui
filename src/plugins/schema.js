import schema from "~/schema";

export default ({ app, store }, inject) => {
  inject("schema", schema);
};
