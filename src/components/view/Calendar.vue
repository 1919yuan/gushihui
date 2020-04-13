<template>
  <div class="block">
    <b-field>
      <span class="button-aligned">
        {{ $util.formatLocalTime(time) }} {{ locationString }}
      </span>
      <b-button tag="a" :href="gcLink" type="is-link">
        <b-icon icon="calendar" />
      </b-button>
    </b-field>
  </div>
</template>

<script>
export default {
  props: {
    time: {
      type: Date,
      required: true
    },
    duration: {
      type: Number,
      default: 30
    },
    location: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      required: true
    },
    agenda: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      default: ""
    }
  },
  computed: {
    locationString () {
      if (this.location) {
        return "@ " + this.location;
      } else if (this.url) {
        return "online";
      } else {
        return "";
      }
    },
    gcLink () {
      const endTime = new Date(this.time);
      endTime.setMinutes(this.time.getMinutes() + this.duration);
      let linkString = "";
      if (this.url) {
        linkString = "Link:+" + this.url + "+";
      }
      return "https://www.google.com/calendar/render?action=TEMPLATE&text=" +
        this.name + "&location=" + this.location.replace(/ /g, "+") + "&dates=" +
        this.$util.formatUTCTimeCalendar(this.time) + "/" +
        this.$util.formatUTCTimeCalendar(endTime) + "&details=" + linkString +
        this.agenda + "&sf=true&output=xml";
    }
  }
};
</script>
