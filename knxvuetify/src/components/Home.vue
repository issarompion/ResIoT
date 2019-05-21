<template>
  <div id="main">
  <v-layout align-center justify-center column>
    <v-toolbar dark color="primary" fixed>
      <v-toolbar-title class="white--text">Knx</v-toolbar-title>
      <v-spacer></v-spacer>
      <span class="subheading" v-if="connected">{{table.ip_table}}</span>
      <v-divider class="mx-3" inset vertical></v-divider>
      <v-toolbar-items>
        <v-dialog width="500" v-model="dialog_connection">
          <template v-slot:activator="{ on }">
            <v-btn block flat v-on="on" :disabled="connected">Connect</v-btn>
          </template>
          <v-card>
            <v-toolbar dark color="primary">
              <v-toolbar-title>Connection</v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
              <v-select
                v-model="table"
                :hint="`${table.ip_table}`"
                :items="tables"
                item-text="nb_table"
                item-value="ip_table"
                label="Table"
                persistent-hint
                return-object
                single-line
              ></v-select>
            </v-card-text>
            <v-card-actions>
              <v-spacer/>
              <v-btn color="primary" flat @click="connect" :loading="loading">Connect</v-btn>
              <v-btn color="disabled" flat @click="dialog_connection = false">Close</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-menu bottom right transition="slide-x-transition">
      <template v-slot:activator="{ on }">
        <v-btn flat block v-on="on">
          <v-icon>power_settings_new</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-tile
          v-for="item in items_disconnect"
          :key="item"
          @click="disconnect"
        >
          <v-list-tile-title>{{ item }}</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-menu>
      </v-toolbar-items>
    </v-toolbar>
  </v-layout>
  <v-container fluid justify-center class="blue lighten-5">
    <v-card class="ma-3 mt-5" xs12>
      <v-layout row justify-space-around >
        <div class="led-box" >
          <div class="led-off" id ="led1"></div>
        </div>
        <div class="led-box">
          <div class="led-off" id ="led2"></div>
        </div>
        <div class="led-box">
          <div class="led-off" id ="led3"></div>
        </div>
          <div class="led-box">
          <div class="led-off" id ="led4"></div>
        </div>
      </v-layout>
    </v-card >

      <v-card v-if="connected" class="ma-3" xs12>
        <v-card-text >
          <v-layout justify-space-around align-center row>
            <v-btn v-on:click="start" class='mr-3' block color="success" :disabled="startboolean">Start</v-btn>
            <v-btn v-on:click="stop" block color="error" class="ml-3" :disabled="!startboolean">Stop</v-btn>
          </v-layout>
        </v-card-text>
      </v-card>
      <v-card v-if="startboolean && connected" xs12 class="ma-3">
        <v-card-title>
          <h1>Vitesse : {{vitesse}}</h1>
        </v-card-title>
        <v-card-text>
          <v-layout justify-space-around>
            <v-btn v-on:click="faster" :disabled="!startboolean">Slower</v-btn>
            <v-btn v-on:click="slower" :disabled="!startboolean">Faster</v-btn>
            <v-spacer/>
           </v-layout>
        </v-card-text>
        <v-card-actions>
          <v-flex >
            <v-select :items="items" :disabled="!startboolean" label="Vitesse" outline v-model="vitesse">{{vitesse}}</v-select>
            </v-flex>
        </v-card-actions>
      </v-card>


      <v-card xs12 class="ma-3" v-if="connected && startboolean">
        <v-card-title>
          <v-layout column>
            <v-layout row>
          <h1>Ordre</h1>
          <v-spacer/>
          <h2 v-if="edit">{{order_fonction}}</h2>
          <v-progress-circular :value="progress"></v-progress-circular>
            </v-layout>
          <v-radio-group row v-model="panel">
            <v-radio :disabled="!connected" label="Normal" value="normal" color="primary"></v-radio>
            <v-radio label="Personnalisé" :disabled="!connected" value="perso" color="primary"></v-radio>
          </v-radio-group>
          <v-spacer/>
          
          </v-layout>
        </v-card-title>
        <v-divider class="mx-3" inset></v-divider>
        <v-card-text>
          <v-layout v-if="edit">
            <v-layout row wrap justify-center>
                <v-flex xs3>
                  <v-checkbox v-model="order" label="Led 1" value=1></v-checkbox>
                </v-flex>
                  <v-flex xs3>
                  <v-checkbox v-model="order" label="Led 2" value=2></v-checkbox>
                  </v-flex>
                  <v-flex xs3>
                  <v-checkbox v-model="order" label="Led 3" value=3></v-checkbox>
                  </v-flex>
                  <v-flex xs3>
                  <v-checkbox v-model="order" label="Led 4" value=4></v-checkbox>
                  </v-flex>
              </v-layout>
            <v-flex xs6>
                
            </v-flex>
            </v-layout>
          <v-flex v-else>
            <v-switch :disabled="!connected" v-model="invert" label="Inverseur" color="warning"> </v-switch>
          </v-flex>
        </v-card-text>
        <v-card-actions>
          <v-btn v-if="edit" flat color="red" @click="reset">Reset Order</v-btn>
        </v-card-actions>
      </v-card>

    <v-layout row justify-center>
      
    </v-layout>
    <v-layout row>
      <v-flex>
        
    </v-flex>
    <v-flex xs6>
      <v-snackbar v-model="snackbar" :timeout=1500>Le délai est trop petit<v-btn color="red" flat @click="snackbar = false">Quit</v-btn></v-snackbar>
    </v-flex>
    </v-layout>
  </v-container>
    </div>
</template>

<script>
import axios from "axios";

export default {
  name: 'Main',
  data () {
    return {
      vitesse: 1000,
      dialog_connection: false,
      startboolean: false,
      order: [],
      edit: false,
      log: false,
      panel: "normal",
      invert: false,
      items: [500,1000,1500,2000],
      items_disconnect: ["Table", "User"],
      snackbar: false,
      table: {nb_table: '5', ip_table: '192.168.0.5'},
      tables: [
        {nb_table: '5', ip_table: '192.168.0.5'},
        {nb_table: '6', ip_table: '192.168.0.6'},
        {nb_table: '10', ip_table: '192.168.0.10'},
      ],
      loading: false,
      connected: false,
    }
  },
  methods: {
    reset (){
      this.order = []
      },
      tableft(){
        console.log("tableft")
        this.disconnect()
      },
      userft(){
        this.$router.push('/log')
      },
    connect: function (){
      //this.dialog_connection = false
      this.loading = true
      axios({ method: "POST", url: "http://localhost:1234/login", data: this.table.nb_table})

    },
    disconnect: function () {
      this.connected = false
      axios({ method: "GET", url: "http://localhost:1234/logout"})
    },
    faster: function () {
        this.vitesse += 100
        
    },
    slower: function () {
      if(this.vitesse >= 600){
        this.vitesse -= 100
      }else{
        this.snackbar = true
      }
    },
    stop: function () {
      if (this.startboolean){
      this.startboolean = false
      var json ={stop: ""}
      var json_string = JSON.stringify(json)

      axios({ method: "POST", url: "http://localhost:1234/stop", data:json_string})
      }
    },
    start: function () {
      if (! this.startboolean){
        this.startboolean = true
        var json ={start: ""}
        var json_string = JSON.stringify(json)

        axios({ method: "POST", url: "http://localhost:1234/start", data:json_string})
      } 
    }
  },
  computed: {
    progress () {
        return (this.order.length / 4) * 100
      },
    expand () {
      if(this.progress == 100)
        return true
      else
        return false
    },
    order_fonction () {
      let result = ""
      this.order.forEach(element => {
        result += element.replace('"',"") + "   "
      });
      return result
    }
  },
  beforeDestroy(){
      this.connected = false
      axios({ method: "GET", url: "http://localhost:1234/logout"})
  },
  beforeMount() {
      this.$options.sockets.onmessage = (msg) => {
        let data = JSON.parse(msg.data)

        switch (data.dest){
          case "0/2/1":
              if(data.state){
                document.getElementById("led1").className ="led-on";
              }else{
                document.getElementById("led1").className ="led-off";
              }
            break
          case "0/2/2":
              if(data.state){
                document.getElementById("led2").className ="led-on";
              }else{
                document.getElementById("led2").className ="led-off";
              }
            //console.log("led 2")
            break
          case "0/2/3":
              if(data.state){
                document.getElementById("led3").className ="led-on";
              }else{
                document.getElementById("led3").className ="led-off";
              }
            //console.log("led 3")
            break
          case "0/2/4":
              if(data.state){
                document.getElementById("led4").className ="led-on";
              }else{
                document.getElementById("led4").className ="led-off";
              }
            //console.log("led 4")
            break
        }
      }
    },
    created(){
      this.log = this.$route.params.log
      if (this.log != true){
        this.$router.push('/log')
      }
    },
  watch: {
    panel: function(){
      if (this.panel == 'normal'){
        if (!this.invert){
          axios({ method: "POST", url: "http://localhost:1234/start"})
        }else{
          axios({ method: "POST", url: "http://localhost:1234/inv"})
        }
        this.edit = false
      }else{
        this.edit = true
      }
    },

    invert: function(){
      var json ={invert: ""}
      var json_string = JSON.stringify(json)

      axios({ method: "POST", url: "http://localhost:1234/inv",data: json_string})
    },
    vitesse: function(){
      var json ={time: this.vitesse}
      var json_string = JSON.stringify(json)

      axios({ method: "POST", url: "http://localhost:1234/time", data: json_string})
    },
    loading: function(){
      if (this.loading == true){
        setTimeout(() => (
        this.loading = false,
        this.dialog_connection = false,
        this.connected = true
        ), 500)
      }
    },
    reset: function(){
      this.reset = false
    },

    order: function(){
      if(this.order.length==4){
        axios({ method: "POST", url: "http://localhost:1234/ordre", data: this.order.toString()})
      }
    },
      
    }
  }
</script>

<style>
.led-box {
  height: 45px;
  width: 6%;
  margin: 10px 10px;
  text-align: center;
  float: left;
}

.led-on {
  margin: 0 auto;
  width: 40px;
  height: 40px;
  background-color: #F00;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(255, 0, 0, 0.5) 0 2px 12px;
}

.led-off {
  margin: 0 auto;
  width: 40px;
  height: 40px;
  background-color: #FFF;
  border-radius: 50%;
  box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, inset #441313 0 -1px 9px, rgba(0, 0, 0, 0) 0 2px 12px;
}
</style>



