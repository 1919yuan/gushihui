<template>
  <div class="container">
    <h3 class="title has-text-centered">
      {{ $t('account.signup') }}
    </h3>
    <div class="box">
      <div class="block">
        <ValidationObserver ref="signup_form">
          <ValidationProvider
            v-slot="{ errors, valid }"
            tag="div"
            class="field"
            :name="$t('field.email')"
            rules="required|email"
          >
            <b-field
              :label="$t('field.email')"
              :type="{ 'is-danger': !valid && email }"
              :message="errors[0]"
            >
              <b-input
                v-model="email"
                type="email"
                :placeholder="$t('ph.email')"
                @keyup.native.enter="doSignup"
              />
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors, valid }"
            tag="div"
            class="field"
            :name="$t('field.password')"
            rules="required|min:6|password|confirmed:password_confirm"
          >
            <b-field
              :label="$t('field.password')"
              :type="{ 'is-danger': !valid && password }"
              :message="errors[0]"
            >
              <b-input
                v-model="password"
                type="password"
                :placeholder="$t('ph.password')"
                password-reveal
                @keyup.native.enter="doSignup"
              />
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors, valid }"
            tag="div"
            class="field"
            :name="$t('field.password_confirm')"
            vid="password_confirm"
            rules="required|min:6|password"
          >
            <b-field
              :label="$t('field.password_confirm')"
              :type="{ 'is-danger': !valid && password }"
              :message="errors[0]"
            >
              <b-input
                v-model="password_confirm"
                type="password"
                :placeholder="$t('ph.password')"
                password-reveal
                @keyup.native.enter="doSignup"
              />
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors, valid }"
            tag="div"
            class="field"
            :name="$t('field.username')"
            rules="required|min:6|username"
          >
            <b-field
              :label="$t('field.username')"
              :type="{ 'is-danger': !valid && username }"
              :message="errors[0]"
            >
              <b-input
                v-model="username"
                :placeholder="$t('ph.username')"
                @keyup.native.enter="doSignup"
              />
            </b-field>
          </ValidationProvider>
        </ValidationObserver>
      </div>
      <div class="block">
        <b-checkbox v-model="rememberme">
          {{ $t('account.rememberme') }}
        </b-checkbox>
        <b-button class="is-block is-primary is-fullwidth" @click="doSignup">
          {{ $t('account.signup') }}
        </b-button>
      </div>
    </div>
    <p class="has-text-grey has-text-centered">
      <nuxt-link to="/login">
        {{ $t('account.login') }}
      </nuxt-link>
    </p>
  </div>
</template>

<script>
import firebase from "firebase/app";
export default {
  data: () => ({
    email: "",
    password: "",
    password_confirm: "",
    username: "",
    rememberme: false
  }),
  methods: {
    async doSignup () {
      const success = await this.$refs.signup_form.validate();
      if (success) {
        try {
          const result = await this.$api.getUserWithUsername(this.username);
          if (result !== this.$schema.kNullUser) {
            this.$buefy.toast.open({
              message: this.$i18n.t("account.username_occupied"),
              type: "is-danger"
            });
            return;
          }
        } catch (err) {
          this.$buefy.toast.open({
            message: this.$util.firebaseError(err.code),
            type: "is-warning"
          });
          return;
        }
        try {
          const persistence = this.rememberme
            ? firebase.auth.Auth.Persistence.LOCAL
            : firebase.auth.Auth.Persistence.SESSION;
          await this.$fireAuth.setPersistence(persistence);
          const userCredential =
                await this.$fireAuth.createUserWithEmailAndPassword(
                  this.email, this.password);
          const provider = userCredential.user ? userCredential.user.providerId
            : "";
          await this.$api.addUser({
            Provider: provider,
            Uid: this.email,
            Username: this.username
          });
          this.$router.back();
        } catch (err) {
          this.$buefy.toast.open({
            message: this.$util.firebaseError(err.code),
            type: "is-danger"
          });
        }
      }
    }
  }
};
</script>
