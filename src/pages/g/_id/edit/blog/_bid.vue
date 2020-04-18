<template>
  <div v-if="isAuthorized" class="container">
    <h2 class="title is-3">
      {{ $t('blog.edit') }}
    </h2>
    <b-field :label="$t('field.title')">
      <b-input v-model="newblog.Title" required />
    </b-field>
    <b-field :label="$t('blog.path')">
      <b-input v-model="newblog.Path" />
    </b-field>
    <b-field :label="$t('blog.author')">
      <b-input v-model="newblog.Author" />
    </b-field>
    <b-field :label="$t('blog.content')">
      <div class="mavonEditor">
        <client-only>
          <mavon-editor v-model="newblog.Content" />
        </client-only>
      </div>
    </b-field>
    <b-button
      class="is-block is-fullwidth"
      type="is-primary"
      @click="doSubmit"
    >
      {{ $t('button.update') }}
    </b-button>
  </div>
</template>

<script>
import { kNullBlog, kNullGroup } from "~/schema";

export default {
  middleware: "auth",
  layout: "article",
  async asyncData ({ app, params }) {
    try {
      const group = await app.$api.getGroup(params.id);
      const blogs = await app.$api.searchBlog(params.id, "", params.bid, new Date(0),
        new Date(0), true);
      return { group, blog: blogs.length > 0 ? blogs[0] : kNullBlog };
    } catch {
      return { group: kNullGroup, blog: kNullBlog };
    }
  },
  data: () => ({ newblog: kNullBlog }),
  computed: {
    isAuthorized () {
      if (!this.$store.getters["account/isLoggedIn"]) {
        return false;
      }
      const ownerGroups = this.$store.state.account.authUser.OwnerGroups;
      const managerGroups = this.$store.state.account.authUser.ManagerGroups;
      return ownerGroups.includes(this.group.Id) || managerGroups.includes(this.group.Id);
    }
  },
  mounted () {
    this.newblog = _.cloneDeep(this.blog);
  },
  methods: {
    async doSubmit () {
      if (!this.newblog.Title || !this.newblog.Content) {
        this.$buefy.toast.open({ message: "Please input valid markdown content in your post." });
        return;
      }
      if (!this.newblog.Path) {
        const d = new Date();
        this.newblog.Path = this.$util.formatLocalDate(d) + this.newblog.title.trim().replace(/\s/g, "_");
      }
      await this.$api.setBlog(this.newblog, this.blog);
      this.$buefy.toast.open({ message: "Article updated!", type: "is-success" });
    }
  }
};
</script>
