<template>
  <div class="container">
    <section class="section">
      <div class="content">
        <p class="title">
          {{ event.Name }}
        </p>
        <p class="subtitle">
          {{ $t('event.organizer') }}
          <a
            v-for="(o, idx) in organizers"
            :key="idx"
            :href="`${o.root}${o.id}`"
          >
            <b-tag type="is-info">
              {{ o.name }}
            </b-tag>
          </a>
        </p>
        <b-notification v-show="isEventOwner">
          <b-field>
            <span class="button-aligned">
              Warning: you are the creator of this event and you can
              delete it:
            </span>
            <b-button type="is-danger" @click="doDelete">
              <b-icon icon="delete" />
            </b-button>
          </b-field>
        </b-notification>
        <h2>{{ $t('field.time') }} & {{ $t('field.location') }}</h2>
        <client-only>
          <Calendar
            :time="event.Options.StartAt"
            :location="event.Venues.length > 0 && event.Venues[0].Address.FormattedAddress || ''"
            :url="event.OnlineVenues.length > 0 && $util.getOnlineVenueUrl(event.OnlineVenues[0]) || ''"
            :name="event.Name"
            :agenda="event.Agenda"
          />
        </client-only>
        <div v-show="rsvpStatus === ''" class="block">
          <p>
            {{ $t('event.rsvp_open') }} | {{
              $util.formatLocalTime(event.Options.RsvpOpen) }}
          </p>
          <p>
            {{ $t('event.rsvp_close') }} | {{
              $util.formatLocalTime(event.Options.RsvpClose) }}
          </p>
        </div>
        <Venue v-for="(v, idx) in event.Venues" :key="'v'+idx" :venue="v" />
        <OnlineVenue
          v-for="(v, idx) in event.OnlineVenues"
          :key="'o'+idx"
          :venue="v"
        />
        <h2>{{ $t('event.agenda') }}</h2>
        <div v-show="agenda" v-html="agenda" />
      </div>
    </section>
    <section class="section">
      <div class="content">
        <h2>{{ $t('event.rsvp') }}</h2>
        <b-notification v-show="rsvpStatus !== ''">
          {{ rsvpStatus }}
        </b-notification>
        <div v-show="rsvpStatus === ''" class="container">
          <p class="label">
            {{ $t('event.choose') }}
          </p>
          <b-field v-for="(c, idx) in event.Options.CategoryNames" :key="idx">
            <p class="control">
              <span class="button is-static">{{ c }}</span>
            </p>
            <b-select v-model="record.Counts[idx]" class="control" expanded>
              <option v-for="(i, iddx) in quotaLimits(event.Options.Quotas[idx])" :key="iddx" :value="i">
                {{ i }}
              </option>
            </b-select>
          </b-field>
          <b-field>
            <b-select
              v-show="!event.Options.CategoryNames.length"
              v-model="record.Count"
            >
              <option v-for="(i, iddx) in quotaLimits(event.Options.Quota)" :key="iddx" :value="i">
                {{ i }}
              </option>
            </b-select>
          </b-field>
          <b-field :label="$t('field.note')">
            <b-input v-model="record.Comment" type="textarea" />
          </b-field>
          <b-button type="is-primary" outlined @click="doRsvp">
            {{ $t('button.submit') }}
          </b-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import { kNullEvent, kNullRecord } from "~/schema";
import Calendar from "~/components/view/Calendar.vue";
import Venue from "~/components/view/Venue.vue";
import OnlineVenue from "~/components/view/OnlineVenue.vue";
const md = require("markdown-it")();

export default {
  layout: "article",
  components: {
    Calendar,
    Venue,
    OnlineVenue
  },
  async asyncData ({ app, params, store }) {
    const event = kNullEvent;
    try {
      const event = await app.$api.getEvent(params.id);
      const agenda = md.render(event.Agenda);
      let group = null;
      let user = null;
      const organizers = [];
      if (event.GroupId) {
        group = await app.$api.getGroup(event.GroupId);
        organizers.push({ root: "/g/", id: group.Id, name: group.Title });
      }
      if (event.UserId) {
        user = await app.$api.getUser(event.UserId);
        organizers.push({ root: "/u/", id: user.Id, name: user.Username });
      }
      let oldRecord = [];
      try {
        oldRecord = await app.$api.searchRecord(
          event.Type, store.state.account.authUser.Id,
          event.Id, "", "", new Date(0), new Date(0));
      } catch (e) {
        console.log(e);
      }
      return { event, agenda, organizers, oldRecord };
    } catch {
      return { event };
    }
  },
  data: () => ({
    record: kNullRecord
  }),
  computed: {
    ...mapGetters("account", ["isLoggedIn"]),
    ...mapState({
      authUser: state => state.account.authUser
    }),
    rsvpStatus () {
      if (this.event.Options.RequireLogin && !this.isLoggedIn) {
        return this.$t("rsvp.login_required");
      }
      if (this.event.Options.RequireLogin && this.isLoggedIn && (this.oldRecord.length > 0)) {
        return this.$t("rsvp.already_done");
      }
      const now = new Date();
      if (this.event.Options.RsvpOpen === this.event.Options.RsvpClose) {
        return this.$t("rsvp.unnecessary");
      } else if (now < this.event.Options.RsvpOpen) {
        return this.$t("rsvp.not_opened", { time: this.$util.formatLocalTime(this.event.Options.RsvpOpen) });
      } else if (now > this.event.Options.RsvpClose) {
        return this.$t("rsvp.closed", { time: this.$util.formatLocalTime(this.event.Options.RsvpClose) });
      } else if (this.event.Options.IsTotalLimited &&
                 this.event.Stats.TotalRemaining <= 0) {
        return this.$t("rsvp.filled");
      } else if (!this.event.Options.IsCountsLimited) {
        return "";
      } else {
        let someClosing = false;
        for (let i = 0; i < this.event.Options.CategoryNames.length; i++) {
          if (this.event.Options.Limits[i] > 0 && this.event.Stats.Remaining[i] <=
              0 && this.event.Options.Required[i]) {
            someClosing = true;
            break;
          }
        }
        let allSoldOut = true;
        for (let i = 0; i < this.event.Options.CategoryNames.length; i++) {
          if (this.event.Options.Limits[i] > 0 && this.event.Stats.Remaining[i] >
              0) {
            allSoldOut = false;
          }
        }
        if (someClosing || allSoldOut) {
          return this.$t("rsvp.filled");
        } else {
          return "";
        }
      }
    },
    isEventOwner () {
      return this.isLoggedIn && (this.event.UserId === this.authUser.Id ||
                                 this.event.EditorId === this.authUser.Id);
    }
  },
  mounted () {
    for (let i = 0; i < this.event.Options.CategoryNames.length; i++) {
      this.record.Counts.push(0);
    }
  },
  methods: {
    async doRsvp () {
      if (this.$store.state.account.authUser.Id) {
        this.record.UserId = this.$store.state.account.authUser.Id;
      }
      this.record.Type = this.event.Type;
      if (this.record.Counts.length > 0) {
        this.record.Count = 0;
        for (let i = 0; i < this.record.Counts.length; i++) {
          this.record.Count += this.record.Counts[i];
        }
      }
      this.record.EventId = this.event.Id;
      this.record.EventGroupId = this.event.GroupId;
      this.record.EventUserId = this.event.UserId;
      try {
        await this.$api.addRecord(this.record);
        this.$buefy.toast.open({
          message: this.$t("rsvp.success"),
          type: "is-success"
        });
        this.$router.go();
      } catch (e) {
        this.$buefy.toast.open({
          message: this.$util.firebaseError(e.message),
          type: "is-danger"
        });
      }
    },
    quotaLimits (q) {
      const counts = [];
      for (let i = 0; i <= q; i++) {
        counts.push(i);
      }
      return counts;
    },
    doDelete () {
      this.$buefy.dialog.confirm({
        message: this.$t("button.areyousure"),
        onConfirm: () => {
          this.$api.delEvent(this.event.Id).then(() => {
            this.$buefy.toast.open({
              message: "Deleted!",
              type: "is-success"
            });
            this.$router.replace({ path: "/" }).then((_) => {
              this.$router.go();
            });
          });
        }
      });
    }
  }
};
</script>
