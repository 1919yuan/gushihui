<template>
  <client-only>
    <div class="container">
      <b-field :label="$t('field.agerange')">
        <b-select v-model="storytimeOptions.AgeRange" @input="emit">
          <option v-for="(o, idx) in ageRanges" :key="idx" :value="o">
            {{ o }}
          </option>
        </b-select>
      </b-field>
      <b-field :label="$t('field.theme')">
        <b-taginput
          v-model="storytimeOptions.Themes"
          icon="label"
          :placeholder="$t('button.add')"
          @input="emit"
        />
      </b-field>
    </div>
  </client-only>
</template>

<script>
import { kNullStorytimeE, kAgeRangeTypeValues } from "~/schema";

export default {
  props: {
    value: {
      type: Object,
      default: () => (kNullStorytimeE)
    }
  },
  data () {
    return {
      storytimeOptions: _.cloneDeep(this.value)
    };
  },
  computed: {
    ageRanges: () => (kAgeRangeTypeValues)
  },
  methods: {
    emit () {
      this.$emit("input", this.storytimeOptions);
    }
  }
};
</script>
