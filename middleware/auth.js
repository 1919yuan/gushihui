export default function ({ store, redirect, route }) {
  if (!store.getters["account/isLoggedIn"]) {
    redirect("/login?from=" + route.path);
  }
}
