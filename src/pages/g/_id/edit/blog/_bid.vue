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
    <b-field :label="$t('blog.searchable')">
      <b-switch v-model="newblog.Searchable">
        {{ $t('blog.searchable') }}
      </b-switch>
    </b-field>
    <div class="buttons">
      <b-button
        tag="nuxt-link"
        :to="`/g/${newblog.GroupId}/blog/${newblog.Path}`"
        type="is-link"
      >
        {{ $t('button.view') }}
      </b-button>
      <b-button
        type="is-primary"
        @click="doUpdate"
      >
        {{ $t('button.update') }}
      </b-button>
      <b-button
        type="is-danger"
        @click="doDelete"
      >
        {{ $t('button.delete') }}
      </b-button>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { kNullBlog, kNullGroup } from "~/schema";

export default {
  middleware: "auth",
  layout: "article",
  async asyncData ({ app, params, router }) {
    try {
      const group = await app.$api.getGroup(params.id);
      const blogs = await app.$api.searchBlog(params.id, "", params.bid, new Date(0),
        new Date(0), true);
      return { group, blog: blogs.length > 0 ? blogs[0] : _.cloneDeep(kNullBlog) };
    } catch {
      return { group: kNullGroup, blog: _.cloneDeep(kNullBlog) };
    }
  },
  data: () => ({ newblog: _.cloneDeep(kNullBlog) }),
  computed: {
    ...mapState({
      authUser: state => state.account.authUser
    }),
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
    if (!this.blog.Id) {
      this.$router.replace({ path: `/g/${this.$route.params.id}` }).then((_) => {
        this.$router.go();
      });
    }
    this.newblog = _.cloneDeep(this.blog);
  },
  methods: {
    async doUpdate () {
      if (!this.newblog.Title || !this.newblog.Content) {
        this.$buefy.toast.open({ message: "Please input valid markdown content in your post." });
        return;
      }
      if (!this.newblog.Path) {
        const d = new Date();
        this.newblog.Path = this.$util.formatLocalDate(d) + this.newblog.title.trim().replace(/\s/g, "_");
      }
      this.newblog.EditorId = this.authUser.Id;
      await this.$api.setBlog(this.newblog, this.blog);
      this.$buefy.toast.open({
        message: "Article updated!", type: "is-success"
      });
      this.blog = _.cloneDeep(this.newblog);
    },
    doDelete () {
      this.$buefy.dialog.confirm({
        message: this.$t("button.areyousure"),
        onConfirm: () => {
          this.$api.delBlog(this.blog.Id).then(() => {
            this.$buefy.toast.open({
              message: "Deleted!",
              type: "is-success"
            });
            this.blog = _.cloneDeep(kNullBlog);
            this.$router.replace({ path: `/g/${this.blog.GroupId}` }).then((_) => {
              this.$router.go();
            });
          });
        }
      });
    }
  }
};
</script>
