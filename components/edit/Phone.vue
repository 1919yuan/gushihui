<template>
  <b-field grouped>
    <b-select
      v-if="askCountry"
      v-model="selectedCountry"
      :placeholder="$t('field.phone_country')"
      @input="emit"
    >
      <option
        v-for="(country, idx) in countries"
        :key="idx"
        :value="country"
      >
        +{{ country.phonecode }}
      </option>
    </b-select>
    <b-input
      v-model="phone.AreaCode"
      :placeholder="$t('field.phone_area')"
      :maxlength="areamax"
      style="max-width:6em"
      @input="emit"
    />
    <b-input
      v-model="phone.Number"
      :placeholder="$t('field.phone_number')"
      :maxlength="nummax"
      style="max-width:12em"
      @input="emit"
    />
  </b-field>
</template>

<script>
import csc from "country-state-city";
import { kNullPhone } from "~/schema";
export default {
  props: {
    value: {
      type: Object,
      default: () => (kNullPhone)
    },
    askCountry: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      phone: _.cloneDeep(this.value.NumberData),
      selectedCountry: csc.getCountryByCode("US")
    };
  },
  computed: {
    countries () {
      if (this.askCountry) {
        return csc.getAllCountries();
      } else { return []; }
    },
    areamax () {
      if (this.selectedCountry.phonecode === "1") {
        return 3;
      } else {
        return 4;
      }
    },
    nummax () {
      if (this.selectedCountry.phonecode === "1") {
        return 7;
      } else {
        return 10;
      }
    }
  },
  methods: {
    emit () {
      this.phone.CountryCode = this.selectedCountry.phonecode;
      this.$emit("input", {
        FormattedNumber: this.$util.formatPhone(this.phone, true),
        NumberData: this.phone
      });
    }
  }
};
</script>
