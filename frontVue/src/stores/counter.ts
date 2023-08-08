import { defineStore } from 'pinia'
import axios from "axios"

export const useCounterStore = defineStore('counter', {
    state: () => ({
      count: 0,
    }),
    getters: {
      doubleCount: (state) => state.count * 2,
    },
  })