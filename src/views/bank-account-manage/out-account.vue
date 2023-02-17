<template>
  <div class="ukey-adjustment app-container flex1 flex-col over-hidden">
    <step-one @nextStep="nextStep" v-if="active === 0"></step-one>
    <step-two @nextStep="nextStep" v-if="active === 1"></step-two>
    <step-three @nextStep="nextStep" v-if="active === 2"></step-three>
    <step-four @nextStep="nextStep" v-if="active === 3"></step-four>
  </div>
</template>

<script>
import stepOne from './components/step-one.vue'
import stepTwo from './components/step-two.vue'
import stepThree from './components/step-three.vue'
import stepFour from './components/step-four.vue'

export default {
  components: {
    'step-one': stepOne,
    'step-two': stepTwo,
    'step-three': stepThree,
    'step-four': stepFour,
  },
  data() {
    return {
      active: 0,
    }
  },

  created() {},
  methods: {
    nextStep(nextActive) {
      this.active = nextActive
    },
  },
}
</script>

<style scoped lang="scss"></style>
