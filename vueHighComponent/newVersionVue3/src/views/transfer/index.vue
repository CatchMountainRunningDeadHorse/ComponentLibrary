<template>
  <div>
    <transfer :data="data" right-title="已选择机型"></transfer>
  </div>
</template>

<script setup>
const data = [
  {
    title: '华为',
    data: [
      {
        id: 1,
        phone_name: 'Mate 40 Pro',
        disabled: true
      },
      {
        id: 2,
        phone_name: '40 Pro',
        disabled: false
      },
      {
        id: 3,
        phone_name: '50 Pro',
        disabled: true
      },
      {
        id: 4,
        phone_name: 'Mate Xs 2',
        disabled: false
      }
    ]
  },
  {
    title: '小米',
    data: [
      {
        id: 5,
        phone_name: '12 Pro',
        disabled: false
      },
      {
        id: 6,
        phone_name: '12s Ultra',
        disabled: false
      },
      {
        id: 7,
        phone_name: '12s',
        disabled: false
      },
      {
        id: 8,
        phone_name: 'Cici 1s',
        disabled: true
      }
    ]
  },
  {
    title: 'iPhone',
    data: [
      {
        id: 9,
        phone_name: '13 mini',
        disabled: true
      },
      {
        id: 10,
        phone_name: '13',
        disabled: false
      },
      {
        id: 11,
        phone_name: '13 Pro',
        disabled: false
      },
      {
        id: 12,
        phone_name: '13 Pro Max',
        disabled: false
      }
    ]
  }
]
</script>