<template>
  <v-card width="400">
    <v-card-title class="py-2 grey lighten-1 text-button rounded-b-0 rounded-t">
      Global providers card
      <v-spacer />
      <v-dialog
        v-model="addProvider"
        width="450"
      >
        <template
          v-slot:activator="{ on, attrs }"
        >
          <v-btn
            icon
            class="white ml-2"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>
              mdi-plus
            </v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="grey lighten-1">
            Provider settings
            <v-spacer/>
            <v-btn
              @click="saveProvider"
            >
              Save
            </v-btn>
          </v-card-title>
          <v-text-field
            class="px-15"
            placeholder="Enter Provider name"
            v-model="providerName"
          />
        </v-card>
      </v-dialog>
    </v-card-title>
    <v-sheet>
      <v-virtual-scroll
        :bench="0"
        :items="providersGlobal"
        :height="250"
        item-height="70"
      >
        <template v-slot:default="{ item }">
          <v-card
              flat
              class="pa-1 px-3 d-flex"
          >
            <v-col cols="9" class="d-flex align-center ">
              Name provider: {{item.name}}
            </v-col>
            <v-col cols="3" class="d-flex align-center">
              <v-btn
                @click="removeProvider(item)"
                icon
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-dialog
                v-model="editProvider"
                width="450"
              >
                <template
                  v-slot:activator="{ on, attrs }"
                >
                  <v-btn
                    icon
                    class="white ml-2"
                    v-bind="attrs"
                    v-on="on"
                    @click="setEdit(item)"
                  >
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title class="grey lighten-1">
                    Provider settings
                    <v-spacer/>
                    <v-btn
                      @click="editedProvider(item)"
                    >
                      Save
                    </v-btn>
                  </v-card-title>
                  <v-text-field
                    class="px-15"
                    placeholder="Enter Provider name"
                    v-model="provderEditName"
                  />
                </v-card>
             </v-dialog>
            </v-col>
          </v-card>
          <v-divider />
        </template>
      </v-virtual-scroll>
    </v-sheet>
  </v-card>
</template>

<script>
import axios from 'axios';
import {
  createProvider, deleteProvider, getProviders, editProvider,
} from '../../config/axiosConfigProviders';
import checkNewProvider from '../helpers/checkNewProvider';

export default {
  name: 'ProvidersCard',
  props: {
    providersGlobal: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      providerName: '',
      provderEditName: '',
      addProvider: false,
      editProvider: false,
    };
  },
  methods: {
    async saveProvider() {
      try {
        const check = checkNewProvider(this.providerName, this.providersGlobal);
        if (!check) {
          this.$notify(check);
        }
        const config = createProvider(this.providerName);
        const response = await axios(config.options);
        if (response.status === 208) {
          this.$notify(config.alreadyExist);
          this.addProvider = false;
          return;
        }
        this.$emit('addProvider', response.data.payload);
        this.addProvider = false;
        this.providerName = '';
        this.$notify(config.success);
      } catch (error) {
        this.$notify({
          type: 'error',
          title: 'An error occurred',
          text: error.message,
        });
      }
    },
    async removeProvider(value) {
      try {
        const config = deleteProvider(value._id);
        await axios(config.options);
        const configGet = getProviders();
        const resultProviders = await axios(configGet.options);
        this.$notify(config.success);
        this.$emit('removeProvider', resultProviders.data.payload);
      } catch (error) {
        this.$notify({
          type: 'error',
          title: 'An error occurred',
          text: error.message,
        });
      }
    },
    setEdit(item) {
      this.provderEditName = item.name;
    },
    async editedProvider(item) {
      try {
        const config = editProvider(this.provderEditName, item._id);
        const response = await axios(config.options);
        if (response.status === 208) {
          this.$notify(config.alreadyExist);
          return;
        }
        this.editProvider = false;
        this.$emit('editProvider', this.provderEditName, item.id);
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
