<template>
  <div class="content">
    <h2> {{ $t('group.events', { id: groupId }) }} </h2>
    <div class="columns is-mobile">
      <EventCard v-for="(event, idx) in events" :key="idx" :event="event" />
    </div>
  </div>
</template>

<script>
import EventCard from "~/components/card/Event.vue";
export default {
  components: {
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
      return { events, groupName: group.Title };
    } catch {
      return { events: [], groupName: params.id };
    }
  },
  computed: {
    groupId () {
      return this.groupName;
    }
  }
};
</script>
