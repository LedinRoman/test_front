<template>
  <v-row class="pt-15">
    <v-col cols="8" class="px-10">
      <v-card>
        <v-card-title class="py-2 grey lighten-1 text-button rounded-t">
        Customers
        <v-spacer />
        customer count: {{ totalNum }}
        <v-dialog
          v-model="addCustomerDialog"
          width="450"
        >
          <template
            v-slot:activator="{ on, attrs }"
          >
            <v-btn
              text
              class="white ml-2"
              v-bind="attrs"
              v-on="on"
            >
              Add Customer
            </v-btn>
          </template>
          <CustomerDialog
            v-if="addCustomerDialog"
            :providers-global="providersGlobal"
            @saveCustomer="onSaveCustomer"
          />
        </v-dialog>
      </v-card-title>
        <v-data-table
          dense
          :headers="headers"
          :items="clientsTable"
          :page="page"
          :items-per-page="limit"
          item-key="email"
          class="elevation-1 pt-1 table-hover"
          @click:row="clickCustomer"
          hide-default-footer
        />
      </v-card>
        <v-pagination
          v-if="clients.length"
          class="px-2 pt-2"
          :v-model="page"
          :total-visible="10"
          :length="numPages"
          :value="page"
          @input="changePage"
        />
    </v-col>
    <v-col cols="4" class="px-10">
      <CustomerCard
        :selected-client="selectedClient"
        @deleteClient="onDeleteClient"
        @editClient="onEditClient"
        :providers-global="providersGlobal"
      />
      <ProvidersCard
        class="mt-10"
        :providers-global="providersGlobal"
        @addProvider="onAddProvider"
        @removeProvider="onRemoveProvider"
        @editProvider="onEditProvider"
      />
    </v-col>
  </v-row>
</template>

<script>
import axios from 'axios';
import CustomerDialog from './CustomerDialog.vue';
import CustomerCard from './CustomerCard.vue';
import ProvidersCard from './ProvidersCard.vue';

import { getPaginated, deleteCustomer } from '../../config/axiosConfigsClients';
import { getProviders } from '../../config/axiosConfigProviders';
import mapProviders from '../helpers/mapProviders';

export default {
  name: 'CustomersList',
  components: {
    CustomerDialog,
    CustomerCard,
    ProvidersCard,
  },
  data() {
    return {
      page: 1,
      limit: 10,
      numPages: 0,
      totalNum: 0,
      headers: [
        { text: 'Name', value: 'name' },
        { text: 'Email', value: 'email' },
        { text: 'Phone', value: 'phone' },
        { text: 'Providers', value: 'providers' },
      ],
      clients: [],
      selectedClient: {},
      providersGlobal: [],
      addCustomerDialog: false,
    };
  },
  computed: {
    clientsTable: {
      get() {
        return this.clients;
      },
      set(value) {
        const index = this.clients.findIndex((item) => item._id === value._id);
        this.clients.splice(index, 1);
        this.clients.push(value);
      },
    },
  },

  async beforeMount() {
    try {
      const configProviders = getProviders();
      const responseProviders = await axios(configProviders.options);
      this.providersGlobal = responseProviders.data.payload;

      const config = getPaginated(this.limit, this.page);
      const responsePagination = await axios(config.options);
      this.clients = responsePagination.data.payload.arrayClients;
      this.clients = mapProviders(this.clients);
      if (this.clients.length) {
        [this.selectedClient] = this.clients;
      }
      this.totalNum = responsePagination.data.payload.totalNum;
      this.numPages = Math.ceil(this.totalNum / this.limit);
    } catch (error) {
      this.$notify({
        type: 'error',
        title: 'An error occurred',
        text: error.message,
      });
    }
  },
  methods: {
    clickCustomer(value) {
      this.selectedClient = value;
    },
    onSaveCustomer(value) {
      this.clients.push(value);
      this.totalNum += 1;
      this.numPages = Math.ceil(this.totalNum / this.limit);
      this.addCustomerDialog = false;
    },
    async onDeleteClient(value) {
      try {
        const config = deleteCustomer(value._id);
        await axios(config.options);
        const spliceIdx = this.clients
          .findIndex((client) => client.email === value.email);
        this.clients.splice(spliceIdx, 1);
        this.selectedClient = {};
        this.totalNum -= 1;
        this.$notify(config.success);

        if (this.clients.length === 1 && this.page !== 1) {
          this.page -= 1;
          this.numPages -= 1;
          const configPagination = getPaginated(this.limit, this.page);
          const resultPagination = await axios(configPagination.options);
          this.clients = resultPagination.data.payload.arrayClients;
          if (this.clients.length) [this.selectedClient] = this.clients;
        }

        if (this.clients.length >= this.limit - 1) {
          const configPagination = getPaginated(this.limit, this.page);
          const resultPagination = await axios(configPagination.options);
          this.clients = resultPagination.data.payload.arrayClients;
          this.numPages = Math.ceil(this.totalNum / this.limit);
        }
      } catch (error) {
        this.$notify({
          type: 'error',
          title: 'An error occurred',
          text: error.message,
        });
      }
    },
    async changePage(value) {
      try {
        this.page = value;
        const config = getPaginated(this.limit, this.page);
        const response = await axios(config.options);
        this.clients = response.data.payload.arrayClients;
        if (this.clients.length) {
          [this.selectedClient] = this.clients;
        }
      } catch (error) {
        this.$notify({
          type: 'error',
          title: 'An error occurred',
          text: error.message,
        });
      }
    },
    onEditClient(value) {
      this.clientsTable = value;
    },
    onAddProvider(value) {
      this.providersGlobal.push(value);
    },
    async onRemoveProvider(value) {
      try {
        this.providersGlobal = value;
        const config = getPaginated(this.limit, this.page);
        const responsePagination = await axios(config.options);
        this.clients = responsePagination.data.payload.arrayClients;
        this.clients = mapProviders(this.clients);
        this.selectedClient = this.clients.length ? this.clients[0] : {};
      } catch (error) {
        this.$notify({
          type: 'error',
          title: 'An error occurred',
          text: error.message,
        });
      }
    },
    async onEditProvider(newName, id) {
      try {
        const index = this.providersGlobal.findIndex((item) => item.id === id);
        this.providersGlobal[index].name = newName;
        const config = getPaginated(this.limit, this.page);
        const responsePagination = await axios(config.options);
        this.clients = responsePagination.data.payload.arrayClients;
        this.clients = mapProviders(this.clients);
        this.selectedClient = this.clients.length ? this.clients[0] : {};
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

<style scoped>
.table-hover:hover {
  cursor: pointer !important;
};
</style>
