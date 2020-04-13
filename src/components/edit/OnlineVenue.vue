<template>
  <div class="block">
    <b-field :label="$t('field.name')">
      <b-field>
        <b-input v-model="venue.Name" expanded @input="emit" />
        <p class="control">
          <b-button outlined type="is-success" @click="doSave">
            {{ $t('venue.save') }}
          </b-button>
        </p>
      </b-field>
    </b-field>
    <b-field :label="$t('venue.online_type')">
      <b-select v-model="venue.Type" expanded @input="emit">
        <option v-for="(v, idx) in venueTypeValues" :key="idx" :value="v">
          {{ v }}
        </option>
      </b-select>
    </b-field>
    <b-field v-show="venue.Type === venueTypes.hangout">
      <Hangout v-model="venue.Hangout" @input="emit" />
    </b-field>
    <b-field v-show="venue.Type === venueTypes.zoom">
      <Zoom v-model="venue.Zoom" @input="emit" />
    </b-field>
    <b-field v-show="venue.Type === venueTypes.skype">
      <Skype v-model="venue.Skype" @input="emit" />
    </b-field>
    <b-field v-show="venue.Type === venueTypes.youtube">
      <Youtube v-model="venue.Youtube" @input="emit" />
    </b-field>
    <b-field :label="$t('field.capacity')">
      <b-numberinput v-model="venue.Capacity" @input="emit" />
    </b-field>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { kNullOnlineVenue } from "~/schema";
import Hangout from "~/components/edit/Hangout";
import Zoom from "~/components/edit/Zoom";
import Skype from "~/components/edit/Skype";
import Youtube from "~/components/edit/Youtube";
export default {
  components: {
    Hangout,
    Zoom,
    Skype,
    Youtube
  },
  props: {
    value: {
      type: Object,
      default: () => (kNullOnlineVenue)
    }
  },
  data () {
    return {
      venue: _.cloneDeep(this.value)
    };
  },
  computed: {
    ...mapState({
      authUser: state => state.account.authUser
    }),
    venueTypeValues () {
      return this.$schema.kOnlineVenueTypeValues;
    },
    venueTypes () {
      return this.$schema.kOnlineVenueTypes;
    }
  },
  methods: {
    emit () {
      this.$emit("input", this.venue);
    },
    async doSave () {
      this.venue.EditorId = this.authUser.Id;
      if (this.$route.query.groupId) {
        this.venue.GroupId = this.$route.query.groupId;
        this.venue.UserId = "";
      } else {
        this.venue.GroupId = "";
        this.venue.UserId = this.authUser.Id;
      }
      await this.$api.saveOnlineVenue(this.venue);
      this.$buefy.toast.open({
        message: "OnlineVenue saved, next time you can use this venue to prefill "+
                   "an event.",
        type: "is-success"
      });
    }
  }
};
</script>
