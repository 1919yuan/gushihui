<template>
  <div class="block">
    <ValidationObserver ref="form">
      <b-steps v-model="step">
        <b-step-item :label="$t('field.group_name')">
          <ValidationProvider
            v-slot="{errors, valid}"
            tag="div"
            class="field"
            :name="$t('field.group_name')"
            rules="required|groupname"
          >
            <b-field
              ref="groupNameField"
              :label="$t('field.group_name')"
              :type="{ 'is-danger': !valid && groupname }"
              :message="errors[0]"
            >
              <b-input
                v-model="groupname"
                :placeholder="$t('ph.groupname')"
              />
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{errors, valid}"
            tag="div"
            class="field"
            :name="$t('field.title')"
            rules="required"
          >
            <b-field
              :label="$t('field.title')"
              :type="{ 'is-danger': !valid && title }"
              :message="errors[0]"
            >
              <b-input
                v-model="title"
                :placeholder="$t('ph.group_title')"
              />
            </b-field>
          </ValidationProvider>
          <ValidationProvider
            v-slot="{errors, valid}"
            tag="div"
            class="field"
            :name="$t('field.description')"
            rules="required"
          >
            <b-field
              :label="$t('field.description')"
              :type="{ 'is-danger': !valid && description }"
              :message="errors[0]"
            >
              <b-input
                v-model="description"
                type="textarea"
                :placeholder="$t('ph.group_description')"
                required
              />
            </b-field>
          </ValidationProvider>
        </b-step-item>
        <b-step-item :label="$t('field.group_owners')">
          <ValidationProvider
            v-for="(owner, idx) in owners"
            :key="idx"
            v-slot="{errors, valid}"
            tag="div"
            class="field"
            :name="$t('field.owner')"
            rules="required|email_or_username"
          >
            <b-field
              ref="ownerField"
              :label="$t('field.owner')"
              :type="{ 'is-danger': !valid && owner }"
              :message="errors[0]"
            >
              <b-input
                v-model="owners[idx]"
                :placeholder="$t('ph.email_or_username')"
                @input="setLastOwnerIdx(idx)"
              />
            </b-field>
          </ValidationProvider>
          <div class="block buttons">
            <b-button outlined @click="doAddOwner">
              {{ $t('button.add') }}
            </b-button>
            <b-button outlined @click="doRemoveOwner">
              {{ $t('button.delete') }}
            </b-button>
          </div>
        </b-step-item>
        <b-step-item :label="$t('field.group_managers')">
          <ValidationProvider
            v-for="(manager, idx) in managers"
            :key="idx"
            v-slot="{errors, valid}"
            tag="div"
            class="field"
            :name="$t('field.manager')"
            rules="required|email_or_username"
          >
            <b-field
              ref="managerField"
              :label="$t('field.manager')"
              :type="{ 'is-danger': !valid && manager }"
              :message="errors[0]"
            >
              <b-input
                v-model="managers[idx]"
                :placeholder="$t('ph.email_or_username')"
                @input="setLastManagerIdx(idx)"
              />
            </b-field>
          </ValidationProvider>
          <div class="block buttons">
            <b-button outlined @click="doAddManager">
              {{ $t('button.add') }}
            </b-button>
            <b-button outlined @click="doRemoveManager">
              {{ $t('button.delete') }}
            </b-button>
          </div>
        </b-step-item>
      </b-steps>
    </ValidationObserver>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return this.$schema.kNullGroup;
      }
    }
  },
  data () {
    return {
      groupname: this.value.group.Id,
      step: this.value.step,
      owners: this.value.group.Owners,
      managers: this.value.group.Managers,
      title: this.value.group.Title,
      description: this.value.group.Description,
      lastOwnerIdx: -1,
      lastManagerIdx: -1
    };
  },
  watch: {
    groupname () {
      this.debouncedCheckGroupName();
    },
    owners () {
      this.debouncedCheckOwner();
    },
    managers () {
      this.debouncedCheckManager();
    },
    step () {
      this.emit();
    }
  },
  created () {
    this.debouncedCheckGroupName = _.debounce(this.checkGroupName, 500);
    this.debouncedCheckOwner = _.debounce(this.checkOwner, 500);
    this.debouncedCheckManager = _.debounce(this.checkManager, 500);
  },
  methods: {
    setLastOwnerIdx (idx) {
      this.lastOwnerIdx = idx;
    },
    setLastManagerIdx (idx) {
      this.lastManagerIdx = idx;
    },
    async checkGroupName () {
      try {
        const result = await this.$api.getGroup(this.groupname);
        if (result !== this.$schema.kNullGroup) {
          this.$refs.groupNameField.message = this.$t("group.occupied");
          this.$refs.groupNameField.type="is-danger";
        } else {
          this.emit();
        }
      } catch {}
    },
    async checkOwner () {
      try {
        const result = await this.$api.searchUser(
          this.owners[this.lastOwnerIdx]);
        if (result !== this.$schema.kNullUser) {
          this.emit();
        } else {
          this.$refs.ownerField[this.lastOwnerIdx].message =
            this.$t("account.resetnotfound");
          this.$refs.ownerField[this.lastOwnerIdx].type = "is-danger";
        }
      } catch {}
    },
    async checkManager () {
      try {
        const result = await this.$api.searchUser(this.owners[
          this.lastManagerIdx]);
        if (result !== this.$schema.kNullUser) {
          this.emit();
        } else {
          this.$refs.managerField[this.lastManagerIdx].message =
            this.$t("account.resetnotfound");
          this.$refx.managerField[this.lastManagerIdx].type = "is-danger";
        }
      } catch {}
    },
    async emit () {
      const success = await this.$refs.form.validate();
      if (success) {
        this.$emit("input", {
          step: this.step,
          group: {
            Id: this.groupname,
            Description: this.description,
            Title: this.title,
            ThumbnailUrl: "",
            Owners: this.owners,
            Managers: this.managers,
            Members: this.value.group.Members
          },
          valid: true
        });
      }
    },
    doAddOwner () {
      this.owners.push("");
    },
    doRemoveOwner () {
      this.owners.pop();
    },
    doAddManager () {
      this.managers.push("");
    },
    doRemoveManager () {
      this.managers.pop();
    }
  }
};
</script>
