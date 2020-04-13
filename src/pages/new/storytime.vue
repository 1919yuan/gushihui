<template>
  <div class="container">
    <h3 class="title has-text-centered">
      {{ $t('storytime.create') }}
    </h3>
    <div class="box">
      <NewStorytime
        v-model="newobj"
        :my-groups="myGroups"
        :prefilled-venues="prefilledVenues"
        :prefilled-online-venues="prefilledOnlineVenues"
        :target-group="targetGroup"
      />
      <div v-show="showSubmit" class="block">
        <b-button class="is-block is-info is-fullwidth" @click="doCreateStorytime">
          {{ $t('button.submit') }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { kNullStorytimeEvent } from "~/schema";
import NewStorytime from "~/components/new/Storytime.vue";
export default {
  components: {
    NewStorytime
  },
  middleware: "auth",
  async asyncData ({ app, route }) {
    const prefilledVenues = await app.$api.getPrefilledVenues(
      route.query.groupId || "");
    const prefilledOnlineVenues = await app.$api.getPrefilledOnlineVenues(
      route.query.groupId || "");
    const myGroups = await app.$api.getMyManagingGroups();
    const targetGroup = await app.$api.getGroup(route.query.groupId);
    return { myGroups, prefilledVenues, prefilledOnlineVenues, targetGroup };
  },
  data () {
    return {
      newobj: {
        storytime: _.cloneDeep(kNullStorytimeEvent),
        step: this.$route.query.groupId ? 1 : 0
      }
    };
  },
  computed: {
    ...mapState({
      authUser: state => state.account.authUser
    }),
    showSubmit () {
      return (this.newobj.step >= 3);
    }
  },
  created () {
    const s = _.cloneDeep(this.$schema.kNullStorytimeEvent);
    const startAt = this.$util.daysOut(new Date(), 7);
    startAt.setHours(10);
    startAt.setMinutes(0);
    const rsvpOpen = new Date();
    rsvpOpen.setMinutes(0);
    const rsvpClose = new Date(startAt);
    if (this.targetGroup !== this.$schema.kNullGroup) {
      s.Name = this.$util.formatLocalDate(startAt) + " " + this.targetGroup.Title;
    }
    s.Options.StartAt = startAt;
    s.Options.RsvpOpen = rsvpOpen;
    s.Options.RsvpClose = rsvpClose;
    this.newobj.storytime = s;
  },
  methods: {
    async doCreateStorytime () {
      this.newobj.storytime.EditorId = this.authUser.Id;
      if (this.targetGroup !== this.$schema.kNullGroup) {
        this.newobj.storytime.GroupId = this.targetGroup.Id;
        this.newobj.storytime.UserId = "";
      } else {
        this.newobj.storytime.GroupId = "";
        this.newobj.storytime.UserId = this.authUser.Id;
      }
      await this.$api.addEvent(this.newobj.storytime);
      this.$buefy.toast.open({
        message: "Event successfully created!",
        type: "is-success"
      });
      this.$router.push({ path: "/u/" });
    }
  }
};
</script>
