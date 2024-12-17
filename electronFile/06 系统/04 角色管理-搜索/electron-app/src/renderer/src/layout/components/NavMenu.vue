<template>
    <div v-if='nextMenu.length <= 0'>
		没有子级菜单
	</div>
    <template
        v-for='item in nextMenu'
		:key='item.id'
    >	
        <el-menu-item :index='item.path'>
			<el-icon>
				<component :is='item.meta?.icon.replace("el-icon-","") || "user" ' />
			</el-icon>
			<template #title>
				<span>{{item.name}}</span>
			</template>
		</el-menu-item>
    </template>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { Parent } from '@interface/user'
defineProps({
	nextMenu:{
		type: Object as PropType<Parent[]>,
    	required: true,
		default:()=>[]
	}
})
</script>