<template>
	<view>
		<slot></slot>
	</view>
</template>

<script>
	//只能h5使用
	import Sortable from "./sortablejs";
	export default {
		props: {
			value: {
				type: Array,
				require:true
			},
		},
		data() {
			return {
				sortable: null
			}
		},
		mounted() {
			this.sortable = new Sortable(this.$el, {
				onEnd: this.onEnd,
				onStart:this.onStart,
				animation: 150,
			});
		},
		beforeDestroy() {
			if (this.sortable) this.sortable.destroy();
		},
		methods: {
			onEnd(event) {
				const {
					oldIndex,
					newIndex
				} = event;
				if (oldIndex === newIndex) return;

				const newList = [...this.value];
				const movedItem = newList.splice(oldIndex, 1)[0];
				newList.splice(newIndex, 0, movedItem);

				this.$emit("input", newList);
				this.$emit("End", newList);
			},
			onStart(event){
				console.log('22222222222222222',event)
			}
		},

	}
</script>

<style>
</style>