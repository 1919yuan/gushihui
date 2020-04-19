<template>
  <div v-if="isAuthorized" class="container">
    <h2 class="title is-3">
      {{ $t('blog.new') }}
    </h2>
    <b-field :label="$t('field.title')">
      <b-input v-model="blog.Title" required />
    </b-field>
    <b-field :label="$t('blog.path')">
      <b-input v-model="blog.Path" />
    </b-field>
    <b-field :label="$t('blog.author')">
      <b-input v-model="blog.Author" />
    </b-field>
    <b-field :label="$t('blog.content')">
      <div class="mavonEditor">
        <client-only>
          <mavon-editor v-model="blog.Content" />
        </client-only>
      </div>
    </b-field>
    <b-field :label="$t('blog.searchable')">
      <b-switch v-model="blog.Searchable">
        {{ $t('blog.searchable') }}
      </b-switch>
    </b-field>
    <b-button
      class="is-block is-fullwidth"
      type="is-primary"
      @click="doSubmit"
    >
      {{ $t('button.publish') }}
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
      return { group };
    } catch {
      return { group: kNullGroup };
    }
  },
  data: () => ({ blog: kNullBlog }),
  computed: {
    isAuthorized () {
      if (!this.$store.getters["account/isLoggedIn"]) {
        return false;
      }
      const ownerGroups = this.$store.state.account.authUser.OwnerGroups;
      const managerGroups = this.$store.state.account.authUser.ManagerGroups;
      return (ownerGroups && ownerGroups.includes(this.$route.params.id)) ||
             (managerGroups && managerGroups.includes(this.$route.params.id));
    }
  },
  mounted () {
    this.blog.Author = this.group.Title;
    this.blog.GroupId = this.group.Id;
  },
  methods: {
    doSubmit () {
      if (!this.blog.Title || !this.blog.Content) {
        this.$buefy.toast.open({ message: "Please input valid markdown content in your post." });
        return;
      }
      if (!this.blog.Path) {
        const d = new Date();
        this.blog.Path = this.$util.formatLocalDate(d) + this.blog.title.trim().replace(/\s/g, "_");
      }
      this.$api.addBlog(this.blog);
    }
  }
};
</script>
