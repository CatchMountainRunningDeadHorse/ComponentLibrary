<template>
	<view style="height:500px;overflow: hidden;overflow-y: auto;">
		<!-- <draggable v-model="items">
			<view v-for="(item,index) in items" :key="index">
				{{item.name}}
			</view>
		</draggable> -->
		<DragSortable v-model="items" :itemHeight="50">
			<template #item="{ item,index }">
				<view :style="{background:item.color}" style="height: 100%;">
					<view style="text-align: center;" >{{ item.name }}</view>
				</view>
			</template>
		</DragSortable>
		<view style="position: absolute;top: 15px;z-index: 10;">
			<MySwitch v-model="value"></MySwitch>
		</view>
		<view style="position: absolute;bottom: 15px;z-index: 10;left: 50px;">
			<MySwitch2 v-model="value"></MySwitch2>
		</view>
	</view>
</template>

<script>
	import DragSortable from '@/components/DragSortable/DragSortable.vue';
	import draggable from '@/components/draggable/draggable.vue';
	import MySwitch from '@/components/Switch/mySwitch.nvue';
	import MySwitch2 from '@/components/Switch/mySwitch2.vue';

	export default {
		components: {
			DragSortable,
			draggable,
			MySwitch,
			MySwitch2
		},
		data() {
			return {
				items: [{
						id: 1,
						name: 'Item 1',
						color:'#f00'
					},
					{
						id: 2,
						name: 'Item 2',
						color:'#0f0'
					},
					{
						id: 3,
						name: 'Item 3',
						color:'#00f'
					},
					{
						id: 4,
						name: 'Item 4',
						color:'#0ff'
					},
					{
						id: 5,
						name: 'Item 5',
						color:'#f0f'
					},
					{
						id: 6,
						name: 'Item 6',
						color:'#88f'
					},
				],
				value:false
			};
		},
		methods:{
			onDragEnd(e){
				console.log('**************',e)
				this.items = e
			},
			updateSwitch(e){
				console.log('1111111111111111',e)
				this.value = e
			}
		}
	};
</script>

<style>
</style>