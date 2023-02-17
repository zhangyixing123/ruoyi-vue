<template>
  <div class="ukey-adjustment app-container flex1 flex-col over-hidden">
    <div>
      <el-button @click="back" size="small">返回</el-button>
    </div>
    <step-one @nextStep="nextStep" v-if="active === 0" :seqNo="seqNo"></step-one>
    <step-two
      @nextStep="nextStep"
      :newUkeyId="newUkeyId"
      v-if="active === 1"
      @back="back"
    ></step-two>
    <step-three @nextStep="nextStep" v-if="active === 2"></step-three>
  </div>
</template>

<script>
import stepOne from './components/step-one.vue'
import stepTwo from './components/step-two.vue'
import stepThree from './components/step-three.vue'

export default {
  props: ['seqNo', 'showUkey'],
  components: {
    'step-one': stepOne,
    'step-two': stepTwo,
    'step-three': stepThree,
  },
  data() {
    return {
      active: 0,
      newUkeyId: '',
    }
  },

  created() {},
  methods: {
    nextStep(nextActive, newUkeyId) {
      this.newUkeyId = newUkeyId
      this.active = nextActive
    },
    back() {
      this.$emit('showUkey')
    },
  },
}
</script>

<style scoped lang="scss"></style>
