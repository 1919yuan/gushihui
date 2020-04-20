<template>
  <div class="container">
    <h3 class="title has-text-centered">
      {{ $route.query.from ? $t('account.login_to_continue') : $t('account.login') }}
    </h3>
    <div class="box">
      <div class="block">
        <ValidationObserver ref="login_form">
          <ValidationProvider
            v-slot="{ errors, valid }"
            tag="div"
            class="field"
            :name="$t('field.email_or_username')"
            rules="required|email_or_username"
          >
            <b-field
              :label="$t('field.email_or_username')"
              :type="{ 'is-danger': !valid && email_or_username }"
              :message="errors[0]"
            >
              <b-input
                v-model="email_or_username"
                :placeholder="$t('ph.email_or_username')"
                @keyup.native.enter="doLogin"
              />
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{ errors, valid }"
            tag="div"
            class="field"
            :name="$t('field.password')"
            rules="required|min:6|password"
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
                @keyup.native.enter="doLogin"
              />
            </b-field>
          </ValidationProvider>
        </ValidationObserver>
      </div>
      <div class="block">
        <b-checkbox v-model="rememberme">
          {{ $t('account.rememberme') }}
        </b-checkbox>
        <b-button class="is-block is-primary is-fullwidth" @click="doLogin">
          {{ $t('account.login') }}
        </b-button>
      </div>
      <div class="block">
        <div class="columns has-text-centered">
          <div class="column is-6">
            <b-button
              type="is-primary"
              outlined
              @click="doLoginWithGoogle"
            >
              <span class="google">
                <img src="~/assets/google.svg">
                {{ $t('account.login_with_google') }}
              </span>
            </b-button>
          </div>
          <div class="column is-6">
            <b-button
              type="is-primary"
              outlined
              @click="doLoginWithFacebook"
            >
              <span class="facebook">
                <img src="~/assets/facebook.svg">
                {{ $t('account.login_with_fb') }}
              </span>
            </b-button>
          </div>
        </div>
      </div>
    </div>
    <p class="has-text-grey has-text-centered">
      <nuxt-link to="/signup">
        {{ $t('account.signup') }}
      </nuxt-link> &nbsp;·&nbsp;
      <nuxt-link to="/reset_password">
        {{ $t('account.forgot') }}
      </nuxt-link>
    </p>
  </div>
</template>

<script>
import firebase from "firebase/app";
export default {
  data: () => ({
    email_or_username: "",
    password: "",
    rememberme: false
  }),
  methods: {
    async doLogin () {
      const success = await this.$refs.login_form.validate();
      if (success) {
        let email = this.email_or_username;
        if (!email.includes("@")) {
          try {
            email = await this.$api.getUserWithUsername(email).Uid;
          } catch (err) {
            this.$buefy.toast.open({
              message: this.$util.firebaseError(err),
              type: "is-danger"
            });
          }
        }
        const persistence = this.rememberme
          ? firebase.auth.Auth.Persistence.LOCAL
          : firebase.auth.Auth.Persistence.SESSION;
        try {
          await this.$fireAuth.setPersistence(persistence);
          await this.$fireAuth.signInWithEmailAndPassword(
            email,
            this.password);
          if (this.$route.query.from) {
            this.$router.push({ path: this.$route.query.from });
          } else {
            this.$router.push({ path: "/" });
          }
        } catch (err) {
          this.$buefy.toast.open({
            message: this.$util.firebaseError(err.code),
            type: "is-danger"
          });
        }
      }
    },
    async _handleOAuthSuccess (result) {
      const user = result.user;
      const credential = result.credential;
      const operationType = result.operationType;
      const info = result.additionalUserInfo;
      if (user && operationType === "signIn" && info.isNewUser) {
        const provider = credential.providerId;
        await this.$api.addUser({
          Provider: provider,
          Uid: user.email,
          Username: ""
        });
      }
      const cstUser = await this.$api.getUserWithEmail(user.email);
      if (cstUser.Username === "") {
        this.$router.push({ path: "finish_signup" });
      } else if (this.$route.query.from) {
        this.$router.push({ path: this.$route.query.from });
      } else {
        this.$router.push({ path: "/" });
      }
    },
    async doLoginWithGoogle () {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/userinfo.email");
      provider.addScope("https://www.googleapis.com/auth/userinfo.profile");
      this.$fireAuth.useDeviceLanguage();
      try {
        const persistence = this.rememberme
          ? firebase.auth.Auth.Persistence.LOCAL
          : firebase.auth.Auth.Persistence.SESSION;
        await this.$fireAuth.setPersistence(persistence);
        const result = await this.$fireAuth.signInWithPopup(provider);
        await this._handleOAuthSuccess(result);
      } catch (err) {
        this.$buefy.toast.open({
          message: this.$util.firebaseError(err.code),
          type: "is-danger"
        });
      }
    },
    async doLoginWithFacebook () {
      const provider = new firebase.auth.FacebookAuthProvider();
      provider.addScope("email");
      this.$fireAuth.useDeviceLanguage();
      try {
        const persistence = this.rememberme
          ? firebase.auth.Auth.Persistence.LOCAL
          : firebase.auth.Auth.Persistence.SESSION;
        await this.$fireAuth.setPersistence(persistence);
        const result = await this.$fireAuth.signInWithPopup(provider);
        await this._handleOAuthSuccess(result);
      } catch (err) {
        this.$buefy.toast.open({
          message: this.$util.firebaseError(err.code),
          type: "is-danger"
        });
      }
    }
  }
};
</script>

<style scoped lang="sass">
.google, .facebook
  img
    width: 16px
    height: 16px
    vertical-align: middle

.google
  font-family: Roboto, sans-serif

.facebook
  font-family: Helvetica, Arial, sans-serif
</style>
