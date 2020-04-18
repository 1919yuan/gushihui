<template>
  <div class="content">
    <div class="level">
      <div class="level-left">
        <h2> {{ $t('group.events', { id: groupName }) }} </h2>
      </div>
      <div v-if="isOwner" class="level-right buttons">
        <b-button tag="nuxt-link" :to="'/new/storytime?groupId='+groupId" type="is-link">
          <b-icon icon="plus" />
        </b-button>
      </div>
    </div>
    <div class="columns is-mobile">
      <EventCard v-for="(event, idx) in events" :key="'e'+idx" :event="event" />
    </div>
    <div class="level">
      <div class="level-left">
        <h2> {{ $t('group.blogs', { id: groupName }) }} </h2>
      </div>
      <div v-if="isOwner" class="level-right buttons">
        <b-button tag="nuxt-link" :to="'/g/'+groupId+'/new/blog'" type="is-link">
          <b-icon icon="plus" />
        </b-button>
      </div>
    </div>
    <div class="columns is-mobile">
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
    } catch (e) {
      console.log(e);
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
