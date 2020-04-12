<template>
  <div class="container">
    <div class="block">
      <h3> {{ $t('event.venues') }} </h3>
      <div class="box">
        <b-field>
          <b-select
            v-model="prefilledVenue"
            :placeholder="$t('venue.prefilled')"
            expanded
          >
            <option v-for="(pv, idx) in prefilledVenues" :key="idx" :value="pv">
              {{ pv.Name }}
            </option>
          </b-select>
          <p class="control">
            <b-button type="is-info" @click="doAddPrefilledVenue">
              {{ $t('venue.prefill') }}
            </b-button>
          </p>
          <p class="control">
            <b-button type="is-primary" outlined @click="doAddVenue">
              {{ $t('venue.add') }}
            </b-button>
          </p>
          <p class="control">
            <b-button type="is-danger" outlined @click="doDeleteVenue">
              <b-icon icon="delete" />
            </b-button>
          </p>
        </b-field>
        <Venue
          v-for="(v, idx) in storytime.Venues"
          :key="idx"
          v-model="storytime.Venues[idx]"
          @input="emit"
        />
      </div>
    </div>
    <div class="block">
      <h3> {{ $t('event.online_venues') }} </h3>
      <div class="box">
        <b-field>
          <b-select
            v-model="prefilledOnlineVenue"
            :placeholder="$t('venue.prefilled_online')"
            expanded
          >
            <option v-for="(pv, idx) in prefilledOnlineVenues" :key="idx" :value="pv">
              {{ pv.Name }}
            </option>
          </b-select>
          <p class="control">
            <b-button type="is-info" @click="doAddPrefilledOnlineVenue">
              {{ $t('venue.prefill') }}
            </b-button>
          </p>
          <p class="control">
            <b-button type="is-primary" outlined @click="doAddOnlineVenue">
              {{ $t('venue.add') }}
            </b-button>
          </p>
          <p class="control">
            <b-button type="is-danger" outlined @click="doDeleteOnlineVenue">
              <b-icon icon="delete" />
            </b-button>
          </p>
        </b-field>
        <OnlineVenue
          v-for="(o, idx) in storytime.OnlineVenues"
          :key="idx"
          v-model="storytime.OnlineVenues[idx]"
          @input="emit"
        />
      </div>
    </div>
  </div>
</template>
n
<script>
import { kNullStorytimeEvent } from "~/schema";
import Venue from "~/components/edit/Venue";
import OnlineVenue from "~/components/edit/OnlineVenue";
export default {
  components: {
    Venue,
    OnlineVenue
  },
  props: {
    value: {
      type: Object,
      default: kNullStorytimeEvent
    },
    prefilledVenues: {
      type: Array,
      default: () => ([])
    },
    prefilledOnlineVenues: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      storytime: _.cloneDeep(this.value),
      prefilledVenue: null,
      prefilledOnlineVenue: null
    };
  },
  methods: {
    doDeleteVenue () {
      this.storytime.Venues.pop();
      this.emit();
    },
    doDeleteOnlineVenue () {
      this.storytime.OnlineVenues.pop();
      this.emit();
    },
    doAddVenue () {
      this.storytime.Venues.push(_.cloneDeep(this.$schema.kNullVenue));
      this.emit();
    },
    doAddOnlineVenue () {
      this.storytime.OnlineVenues.push(_.cloneDeep(this.$schema.kNullOnlineVenue));
      this.emit();
    },
    doAddPrefilledVenue () {
      if (this.prefilledVenue !== null) {
        this.storytime.Venues.push(_.cloneDeep(this.prefilledVenue));
        this.emit();
      }
    },
    doAddPrefilledOnlineVenue () {
      if (this.prefilledOnlineVenue !== null) {
        this.storytime.OnlineVenues.push(_.cloneDeep(this.prefilledOnlineVenue));
        this.emit();
      }
    },
    emit () {
      this.$emit("input", this.storytime);
    },
    reset (val) {
      this.venues = _.cloneDeep(val.Venues);
      this.onlineVenues = _.cloneDeep(val.onlineVenues);
    }
  }
};
</script>
