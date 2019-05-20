<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs5>
              <v-layout align-center justify-center>
                <v-img :src="require('../assets/logoknx.jpg')" aspect-ratio="1" width="200"></v-img>
              </v-layout>
                <v-text-field label="Username" prepend-icon="account_box" v-model="username"></v-text-field>
                <v-text-field label="Password" prepend-icon="vpn_key" v-model="password"></v-text-field>
                <v-btn color="info" flat @click="connect">Connect</v-btn>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>

</template>

<script>

  export default {
    data() {
      return {
        username: "",
        password: "",
      }
    },
    methods: {
      connect: function(){
        if(this.username == "admin" && this.password == "admin"){
          this.$router.push({name: 'home', params: { log: true }})
        }
        
      }
    }
  }
</script>
