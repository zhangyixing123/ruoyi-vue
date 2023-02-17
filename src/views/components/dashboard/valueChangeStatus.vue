<template>
    <div class="value-change">
        <span>{{ value }}</span>
        <div :class="['status', changeStatus]"></div>
    </div> 
</template> 

<script>
export default {
    props: {
        value: {
            type: Number,
            default: 0
        },
        changeStatus: {
            type: String,
            default: 'increase'
        }
    },
    data() {
        return {};
    },
};
</script>

<style scoped lang="scss">
.value-change {
    display: flex;
    align-items: center;
}
.status {
    width: 0;
    height: 0;
    border: 5px solid ;
    border-top-color: transparent;
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-left-color: transparent;
}
.increase {
    border-bottom-color: red !important;
}
.decrease {
    border-top-color: green !important;
}
</style>
