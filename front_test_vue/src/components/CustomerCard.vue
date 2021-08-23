<template>
    <v-card v-if="(Object.keys(selectedClient)).length" width="400">
        <v-card-title class="py-2 grey lighten-1 text-button rounded-b-0 rounded-t">
            Selected client
        </v-card-title>
        <v-card-text class="pt-1">
          Client's name: {{ selectedClient.name }} <br>
        <v-combobox
          class="py-2"
          readonly
          label="Providers"
          dense
          outlined
          hide-details
          multiple
          :value="selectedClient.providers"
        />
          Contacts: <br>
          {{selectedClient.email}} <br>
          {{selectedClient.phone}}
        </v-card-text>
        <v-divider />
        <v-card-actions>
          <v-dialog
            v-model="editDialog"
            min-width="450"
            width="450"
          >
            <template
            v-slot:activator="{ on, attrs }"
          >
            <v-btn
              class="grey lighten-1 mr-2"
              v-bind="attrs"
              v-on="on"
            >
              Edit
            </v-btn>
          </template>
          <CustomerDialog
            v-if="editDialog"
            :edit-customer="selectedClient"
            :providers-global="providersGlobal"
            @saveEditedCustomer="onSaveEditedCustomer"
          />
          </v-dialog>
            <v-btn
              color="grey lighten-1"
              @click="deleteCustomer"
            >
                Delete
            </v-btn>
        </v-card-actions>
    </v-card>
    <v-card  width="400" v-else>
      <v-card-title class="py-2 grey lighten-1 text-button rounded-b-0">
        Selected client
      </v-card-title>
      <v-card-text class="pt-4">
        Select another client
      </v-card-text>
    </v-card>
</template>

<script>
import CustomerDialog from './CustomerDialog.vue';

export default {
  name: 'CustomerCard',
  components: {
    CustomerDialog,
  },
  data() {
    return {
      editDialog: false,
    };
  },
  props: {
    selectedClient: {
      type: Object,
      default: () => {},
    },
    providersGlobal: {
      type: Array,
      default: () => {},
    },
  },
  methods: {
    deleteCustomer() {
      this.$emit('deleteClient', this.selectedClient);
    },
    onSaveEditedCustomer(value) {
      this.$emit('editClient', value);
      this.editDialog = false;
    },
  },
};
</script>
