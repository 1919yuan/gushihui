<template>
  <client-only>
    <div class="container">
      <h3> {{ $t('event.options') }} </h3>
      <b-field :label="$t('field.time')">
        <b-datetimepicker
          v-model="startAt"
          :placeholder="$t('ph.select_time')"
          icon="calendar-today"
          :timepicker="timepicker"
          :min-datetime="minTime"
          :max-datetime="maxTime"
          @input="emit"
        />
      </b-field>
      <b-field :label="$t('event.rsvp_open')">
        <b-datetimepicker
          v-model="rsvpOpen"
          :placeholder="$t('ph.select_time')"
          icon="calendar-today"
          :timepicker="timepicker"
          :min-datetime="minTime"
          :max-datetime="maxTime"
          @input="emit"
        />
      </b-field>
      <b-field :label="$t('event.rsvp_close')">
        <b-datetimepicker
          v-model="rsvpClose"
          :placeholder="$t('ph.select_time')"
          icon="calendar-today"
          :timepicker="timepicker"
          :min-datetime="minTime"
          :max-datetime="maxTime"
          @input="emit"
        />
      </b-field>
      <b-field :label="$t('field.duration')">
        <b-numberinput v-model="duration" step="30" @input="emit" />
      </b-field>
      <b-field grouped grouped-multiline>
        <p class="control">
          <b-switch v-model="storytime.Options.IsTotalCountLimited" @input="emit">
            {{ $t('event.limit_total') }}
          </b-switch>
        </p>
        <p class="control">
          <b-switch v-model="storytime.Options.Categorize" @input="emit">
            {{ $t('event.categorize') }}
          </b-switch>
        </p>
        <p class="control">
          <b-switch v-model="storytime.Options.IsCountsLimited" @input="emit">
            {{ $t('event.limit_per_cat') }}
          </b-switch>
        </p>
        <p class="control">
          <b-switch v-model="storytime.Options.RequireLogin" @input="emit">
            {{ $t('event.require_login') }}
          </b-switch>
        </p>
        <p class="control">
          <b-button v-show="storytime.Options.Categorize" @click="doAddCat">
            {{ $t('event.addcat') }}
          </b-button>
        </p>
        <p class="control">
          <b-button v-show="storytime.Options.Categorize" @click="doDelCat">
            {{ $t('event.subcat') }}
          </b-button>
        </p>
      </b-field>
      <b-field
        v-for="(cat, idx) in storytime.Options.CategoryNames"
        v-show="storytime.Options.Categorize"
        :key="idx"
        grouped
      >
        <p class="control">
          <b-input
            v-model="storytime.Options.CategoryNames[idx]"
            :placeholder="$t('event.catname')"
            @input="emit"
          />
        </p>
        <p class="control">
          <b-numberinput
            v-show="storytime.Options.IsCountsLimited"
            v-model="storytime.Options.Limits[idx]"
            @input="emit"
          />
        </p>
      </b-field>
      <b-notification>
        Your venue capacities are: {{ venueCapacities }}
      </b-notification>
      <b-field
        v-show="storytime.Options.IsTotalCountLimited"
        :label="$t('event.total_limit')"
      >
        <b-numberinput
          v-model="storytime.Options.TotalLimit"
          @input="emit"
        />
      </b-field>
    </div>
  </client-only>
</template>

<script>
import { kNullStorytimeEvent } from "~/schema";
export default {
  props: {
    value: {
      type: Object,
      default: () => (kNullStorytimeEvent)
    }
  },
  data () {
    const maxTime = new Date();
    maxTime.setDate(maxTime.getDate() + 60);
    return {
      storytime: _.cloneDeep(this.value),
      minTime: new Date(),
      maxTime,
      duration: 30,
      timepicker: {
        incrementMinutes: 30,
        incrementHours: 1,
        hourFormat: "12"
      },
      startAt: this.value.Options.StartAt,
      rsvpOpen: this.value.Options.RsvpOpen,
      rsvpClose: this.value.Options.RsvpClose
    };
  },
  computed: {
    venueCapacities () {
      let result = "";
      let i = 0;
      for (i = 0; i < this.storytime.Venues.length; i++) {
        const v = this.storytime.Venues[i];
        if (v.Capacity > 0) {
          result += v.Name + ": " + v.Capacity + " ";
        }
      }
      for (i = 0; i < this.storytime.OnlineVenues.length; i++) {
        const o = this.storytime.OnlineVenues[i];
        if (o.Capacity > 0) {
          result += o.Name + ": " + o.Capacity + " ";
        }
      }
      return result;
    }
  },
  methods: {
    doAddCat () {
      this.storytime.Options.CategoryNames.push("");
      this.storytime.Options.Limits.push(0);
      this.storytime.Options.Quotas.push(5);
      this.storytime.Options.Required.push(true);
      this.storytime.Stats.Counts.push(0);
      this.storytime.Stats.Remaining.push(0);
      this.emit();
    },
    doDelCat () {
      this.storytime.Options.CategoryNames.pop();
      this.storytime.Options.Limits.pop();
      this.storytime.Options.Quotas.pop();
      this.storytime.Options.Required.pop();
      this.storytime.Stats.Counts.pop();
      this.storytime.Stats.Remaining.pop();
      this.emit();
    },
    emit () {
      this.storytime.Options.StartAt = this.startAt;
      this.storytime.Options.RsvpOpen = this.rsvpOpen;
      this.storytime.Options.RsvpClose = this.rsvpClose;
      for (let i = 0; i < this.storytime.Options.Limits.length; i++) {
        this.storytime.Stats.Remaining[i] = this.storytime.Options.Limits[i];
      }
      this.storytime.Stats.TotalRemaining = this.storytime.Options.TotalLimit;
      this.storytime.Duration = this.duration;
      this.$emit("input", this.storytime);
    },
    reset (val) {
      this.storytime = _.cloneDeep(val);
    }
  }
};
</script>
