<template>
  <div class="content">
    <h2> {{ $t('group.events', { id: groupName }) }} </h2>
    <div v-if="isOwner" class="block buttons">
      <b-button
        tag="nuxt-link"
        :to="'/new/storytime?groupId='+groupId"
        type="is-link"
      >
        {{ $t('nav.newstorytime') }}
      </b-button>
    </div>
    <div class="columns is-mobile">
      <EventCard v-for="(event, idx) in events" :key="'e'+idx" :event="event" />
    </div>
    <h2> {{ $t('group.blogs', { id: groupName }) }} </h2>
    <div v-if="isOwner" class="block buttons">
      <b-button tag="nuxt-link" :to="'/g/'+groupId+'/new/blog'" type="is-link">
        {{ $t('button.add') }}
      </b-button>
    </div>
    <div class="columns is-mobile is-multiline">
      <BlogCard v-for="(blog, idx) in blogs" :key="'b'+idx" :blog="blog" />
    </div>
  </div>
</template>

<script>
import EventCard from "~/components/card/Event.vue";
import BlogCard from "~/components/card/Blog.vue";
export default {
  components: {
    BlogCard,
    EventCard
  },
  layout: "article",
  async asyncData ({ app, params }) {
    try {
      const begin = new Date();
      const end = new Date(begin);
      end.setDate(begin.getDate() + 60);
      const events = await app.$api.searchEvent("", params.id, "", begin, end);
      const group = await app.$api.getGroup(params.id);
      const blogs = await app.$api.searchBlog(params.id, "", "", new Date(0), new Date(0), false);
      return { events, groupName: group.Title, blogs };
    } catch {
      return { events: [], groupName: params.id, blogs: [] };
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
      return (ownerGroups && ownerGroups.includes(this.$route.params.id)) ||
             (managerGroups && managerGroups.includes(this.$route.params.id));
    }
  }
};
</script>
