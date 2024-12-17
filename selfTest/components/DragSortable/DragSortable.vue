<template>
	<movable-area class="container" :style="{height:areaHeight+'px'}">
		<movable-view v-for="(item, index) in localItems" :key="item[itemKey]" :data-index="index" class="item"
			:disabled="isCanMove ? false : true" :y="item.positionY" :x="0" :damping="50" direction="all"
			@change="dragMoving" @touchstart="handleDragStart(index)" @touchend="onDragEnd"
			@longpress="handleLongpress(index)" :style="{height:itemHeight+'px'}">
			<slot name="item" :item="item" :index="index"></slot>
		</movable-view>
	</movable-area>
</template>

<script>
	export default {
		name: "DragSortable",
		props: {
			value: {
				type: Array,
				required: true,
			},
			itemHeight: {
				type: Number,
				default: 100, // 每个 item 的高度，单位 px
			},
			itemKey: {
				type: String,
				default: 'id'
			}
		},
		data() {
			return {
				localItems: [],
				movedItem: null,
				oldIndex: null,
				currentY: 0,
				newIndex: null,
				isCanMove: false
			};
		},
		computed: {
			areaHeight() {
				return this.itemHeight * this.value.length
			}
		},
		watch: {
			value: {
				immediate: true,
				handler(newValue) {
					this.localItems = newValue.map((item, index) => ({
						...item,
						positionY: index * this.itemHeight,
					}));
					this.localItems = [...this.localItems]
				},
			},
		},
		methods: {
			handleDragStart(index) {
				// 	this.movedItem = this.localItems[index];
				// 	this.movedKey = this.movedItem[this.itemKey]
				// 	this.isCanMove = true
			},
			handleLongpress(index) {
				this.movedItem = this.localItems[index];
				this.movedKey = this.movedItem[this.itemKey]
				this.isCanMove = true
			},
			dragMoving(e) {
				if (!this.isCanMove) return
				if (e.detail.source !== 'touch') return;
				const {
					x,
					y,
					dataset
				} = e.target
				this.currentY = y;
				this.newIndex = Math.round(y / this.itemHeight)

				//localItems在移动过程中会被更新，获取每次更新后的移动项（movedItem）的下标位置
				this.oldIndex = this.localItems.findIndex((item) => {
					return item[this.itemKey] === this.movedKey
				})
				this.movedItem.positionY = y
				if (this.newIndex == this.oldIndex) {
					this.localItems.splice(this.oldIndex, 1, this.movedItem)
					return
				} else {
					const newList = [...this.localItems];
					newList.splice(this.oldIndex, 1);
					newList.splice(this.newIndex, 0, this.movedItem);
					this.localItems = newList.map((item, index) => {
						if (this.newIndex !== index) {
							item.positionY = index * this.itemHeight
						}
						return {
							...item
						}
					})
				}
			},

			onDragEnd(e) {
				this.isCanMove = false
				//移除 item 上比原始值多出来的 positionY 属性，确保回传的值属性不变
				const newList = [...this.localItems].map((item, index) => {
					delete item.positionY
					return {
						...item
					}
				});
				//鼠标抬起  || 手指离开屏幕  触发父组件更新列表
				this.$emit("input", newList);
				this.$emit("End", newList);
			},
		},
	};
</script>

<style>
	.container {
		width: 100%;
		/* height: auto; */
		position: relative;
	}

	.item {
		width: 100%;
	}
</style>