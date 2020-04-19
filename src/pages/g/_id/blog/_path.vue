<template>
  <div>
    <div class="content">
      <p class="title">
        {{ blog.Title }}
      </p>
      <p class="subtitle">
        {{ blog.Author }} &nbsp; {{ $util.formatLocalDate(blog.Updated) }}
      </p>
      <div v-html="html" />
    </div>
    <div v-show="isOwner" class="block">
      <b-button
        tag="nuxt-link"
        :to="{ path: '/g/' + groupId + '/edit/blog/' + blog.Path }"
        type="is-primary"
        class="is-block is-fullwidth"
      >
        {{
          $t('button.edit') }}
      </b-button>
    </div>
  </div>
</template>

<script>
import { kNullBlog } from "~/schema";
const md = require("markdown-it")();
export default {
  layout: "article",
  async asyncData ({ app, params }) {
    const blogs = await app.$api.searchBlog(params.id, "", params.path, new Date(0), new Date(0), true);
    if (blogs.length > 0) {
      const html = md.render(blogs[0].Content);
      return { blog: blogs[0], html };
    } else {
      return { blog: kNullBlog, html: "" };
    }
  },
  computed: {
    groupId () {
      return this.$route.params.id;
    },
    isOwner () {
      if (!this.$store.getters["account/isLoggedIn"]) {
        return false;
      }
      const ownerGroups = this.$store.state.account.authUser.OwnerGroups;
      const managerGroups = this.$store.state.account.authUser.ManagerGroups;
      return (ownerGroups && ownerGroups.includes(this.$route.params.id)) || (managerGroups && managerGroups.includes(this.$route.params.id));
    }
  }
};
</script>
