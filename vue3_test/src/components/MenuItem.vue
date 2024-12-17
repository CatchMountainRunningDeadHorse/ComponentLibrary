<template>
  <div class="customStyle">
    <ul v-if="item.children &&item.children.length > 0">
        <li>
            <router-link :to="{name:item.name}">
                {{ item.meta.title }}
            </router-link>
            <template v-for="(c,i) in item.children" :key="i">
                <MenuItem :item="c"></MenuItem>
            </template>
        </li>
    </ul>

    <ul v-else>
        <router-link :to="{name:item.name}">{{ item.meta.title }}</router-link>
    </ul>
  </div>
</template>

<script setup>
    const props = defineProps({
        item: {
            type: Object,
        }
    });
</script>
    
<style>
.customStyle {
    color: #000 !important;
    /* padding-left: 30px; */
}

</style>