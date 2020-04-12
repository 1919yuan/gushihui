<template>
  <div class="content">
    <h2> {{ $t('event.all') }} </h2>
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
  async asyncData ({ app, route }) {
    try {
      const begin = new Date();
      const end = new Date(begin);
      end.setDate(begin.getDate() + 60);
      const events = await app.$api.searchEvent(route.query.type || "", "", "", begin, end);
      return { events };
    } catch {
      return { events: [] };
    }
  }
};
</script>
