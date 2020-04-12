<template>
  <div class="container">
    <b-field v-if="askName" :label="$t('field.address_name')">
      <b-input v-model="address.Name" @input="emit" />
    </b-field>
    <b-field :label="$t('field.address_street_line1')">
      <b-input v-model="address.Line1" @input="emit" />
    </b-field>
    <b-field :label="$t('field.address_street_line2')">
      <b-input v-model="address.Line2" @input="emit" />
    </b-field>
    <b-field grouped>
      <b-select
        v-model="selectedCity"
        :placeholder="$t('field.city')"
        expanded
        @input="emit"
      >
        <option v-for="(city, idx) in cities" :key="idx" :value="city">
          {{ city.name }}
        </option>
      </b-select>
      <b-select
        v-model="selectedState"
        :placeholder="$t('field.state')"
        @input="emit"
      >
        <option v-for="(state, idx) in states" :key="idx" :value="state">
          {{ state.name }}
        </option>
      </b-select>
      <b-input
        v-model="address.ZipCode"
        :placeholder="$t('field.zipcode')"
        @input="emit"
      />
    </b-field>
    <b-field v-if="askCountry" :label="$t('field.address_country')">
      <b-select
        v-model="selectedCountry"
        :placeholder="$t('field.country')"
        @input="emit"
      >
        <option
          v-for="(country, idx) in countries"
          :key="idx"
          :value="country"
        >
          {{ country.name }}
        </option>
      </b-select>
    </b-field>
  </div>
</template>

<script>
import csc from "country-state-city";
import { kNullAddress } from "~/schema";
export default {
  props: {
    value: {
      type: Object,
      default: () => (kNullAddress)
    },
    askName: {
      type: Boolean,
      default: false
    },
    askCountry: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const data = this.value.AddressData;
    const country = this.$util.getMatchingCountry(data);
    const state = this.$util.getMatchingState(data, country);
    const city = this.$util.getMatchingCity(data, state);
    return {
      address: _.cloneDeep(this.value.AddressData),
      selectedCountry: country,
      selectedState: state,
      selectedCity: city
    };
  },
  computed: {
    countries () {
      if (this.askCountry) {
        return csc.getAllCountries();
      } else { return []; }
    },
    states () {
      if (this.selectedCountry) {
        return csc.getStatesOfCountry(this.selectedCountry.id);
      } else {
        return [];
      }
    },
    cities () {
      if (this.selectedState) {
        return csc.getCitiesOfState(this.selectedState.id);
      } else {
        return [];
      }
    }
  },
  methods: {
    emit () {
      this.address.Country =
        (this.selectedCountry && this.selectedCountry.name) || "";
      this.address.State =
        (this.selectedState && this.selectedState.name) || "";
      this.address.City =
        (this.selectedCity && this.selectedCity.name) || "";
      this.$emit("input", {
        FormattedAddress: this.$util.formatAddress(this.address, true, true),
        AddressData: this.address
      });
    }
  }
};
</script>
