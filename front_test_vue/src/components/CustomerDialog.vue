<template>
    <v-card>
        <v-card-title class="py-2 mb-2 grey lighten-1 text-button">
            Add customer
            <v-spacer />
            <v-btn
              text
              @click="saveCustomer"
              class="grey"
            >
            Save customer
            </v-btn>
        </v-card-title>
        <v-sheet class="pa-3">
          <v-row
            v-for="item, idx in customerField"
            :key="idx"
            class="d-flex align-center px-2"
          >
            <v-col cols="3" class="pa-0 pb-6">
              <b>{{ item.title }}:</b>
            </v-col>
              <v-col cols="9" class="py-0">
            <v-text-field
              dense
              outlined
              clearable
              v-model="customer[item.key]"
              :rules="item.key === 'email' ? [rules.email, rules.required] :
              item.key === 'phone' ? [rules.phone, rules.required] : [rules.required, rules.count]"
              placeholder="Enter data"
            />
            </v-col>
          </v-row>
            <v-select
              class="pt-2"
              v-model="customer.providers"
              :items="globalProvidersMapped"
              chips
              label="Providers"
              multiple
              solo
              hide-details
            />
        </v-sheet>
    </v-card>
</template>

<script>
import axios from 'axios';
import checkNewCustomer from '../helpers/checkNewCustomer';
import { createCustomer, editCustomer } from '../../config/axiosConfigsClients';

const defaultCustomer = () => ({
  name: '',
  email: '',
  phone: '',
  providers: [],
});

export default {
  name: 'CustomerDialog',
  props: {
    editCustomer: {
      type: Object,
      default: () => {},
    },
    providersGlobal: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      customer: defaultCustomer(),
      globalProvidersMapped: [],
      customerField: [
        { title: "Client's name", key: 'name' },
        { title: "Client's email", key: 'email' },
        { title: "Client's phone", key: 'phone' },
      ],
      rules: {
        required: (value) => !!value || 'Required to be filled',
        email: (value) => {
          const pattern = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
          return pattern.test(value) || 'Invalid e-mail.';
        },
        phone: (value) => /^\d{11}$/.test(value) || 'Phone should contain 11 digits',
        count: (value) => value.length <= 15 || 'Max 15 characters',
      },
    };
  },
  beforeMount() {
    this.globalProvidersMapped = this.providersGlobal.map((item) => item.name);
    if (this.editCustomer) {
      this.customer = JSON.parse(JSON.stringify(this.editCustomer));
    }
  },
  methods: {
    async saveCustomer() {
      try {
        const check = checkNewCustomer(this.customer);
        if (check.type === 'error') {
          this.$notify(check);
          return;
        }
        const oldProviders = [...this.customer.providers];
        this.customer.providers = this.customer.providers.reduce((acc, item) => {
          const providerObj = this.providersGlobal.find((value) => value.name === item);
          if (providerObj) {
            acc.push(providerObj._id.toString());
          }
          return [...acc];
        }, []);

        const config = this.editCustomer ? editCustomer(this.customer)
          : createCustomer(this.customer);
        const response = await axios(config.options);
        if (response.status === 208) {
          this.$notify(config.alreadyExist);
          this.customer.providers = oldProviders;
          return;
        }

        if (this.editCustomer) {
          this.customer.providers = oldProviders;
          this.$emit('saveEditedCustomer', this.customer);
        } else {
          this.customer.providers = oldProviders;
          this.$emit('saveCustomer', this.customer);
        }

        this.customer = defaultCustomer();
        this.$notify(config.success);
      } catch (error) {
        this.$notify({
          type: 'error',
          title: 'An error occurred',
          text: error.message,
        });
      }
    },
  },
};
</script>
