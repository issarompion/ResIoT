import Vue from 'vue'
import Vuex from 'vuex'
//import Axios from 'axios'

Vue.use(Vuex);

export const store = new Vuex.Store({
  state : {
    state : {
        chats : null,
        handle : ''
      },
  },
  getters : {},
  mutations : {},
  actions : {}
})