<template>
  <Dragging v-model:list="imageList">
    <n-image v-for="item in imageList" :key="item" :src="item" />
  </Dragging>
</template>

<script setup lang="ts">
  import Dragging from '@/components/dragging.vue'

  import { reactive } from 'vue'

  // 图片列表
  const imageList = reactive<Array<string>>([
    'https://tupian.qqw21.com/article/UploadPic/2020-3/20203521573255419.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2020-3/20203711181187456.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2020-3/20203521573780177.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2020-3/2020371118881620.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2020-3/2020371118881620.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2019-9/201992019415560455.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2019-10/2019101322473912795.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2019-10/2019101322473922544.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2020-3/2020371118786223.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2020-3/20203521573435244.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2020-3/20203521573620628.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2020-5/202052716501131783.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2019-9/201991122412651867.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2020-3/202032322421640295.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2019-4/2019472258417421.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2020-3/20203420284741305.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2020-5/202052122353816334.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2020-1/20201517303983172.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2020-3/202032220382385002.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2020-5/202051022515462876.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2019-2/2019220025948491.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2020-10/2020102822153439339.jpg',
    'https://img95.699pic.com/photo/50107/2992.jpg_wh300.jpg!/fh/300/quality/90',
    'https://tupian.qqw21.com/article/UploadPic/2020-5/202052122354035682.jpg',
    'https://tupian.qqw21.com/article/UploadPic/2020-1/20201517304055739.jpg',
    'https://img95.699pic.com/photo/50078/7865.jpg_wh300.jpg!/fh/300/quality/90',
    'https://img.tukuppt.com/ad_preview/00/30/89/bdK2YpIGxM.jpg!/fw/260',
    'https://ts1.cn.mm.bing.net/th/id/R-C.8d90a2663b4eb3e8908f3cafccfa0ac4?rik=t8L5JeA69ie71g&riu=http%3a%2f%2fimg.sj33.cn%2fuploads%2fallimg%2f200903%2f20090325103629510.jpg&ehk=6Xv9f9Am4hXVio3wKUBnb2yWXrmA%2fVzkbxvEhUIvl2I%3d&risl=&pid=ImgRaw&r=0',
    'https://img95.699pic.com/photo/50109/9502.jpg_wh300.jpg!/fh/300/quality/90',
    'https://ts1.cn.mm.bing.net/th/id/R-C.08879eb8b7c83e4eac1183ede67eea52?rik=yPCl7JcAKbYpUw&riu=http%3a%2f%2fimg.redocn.com%2fsheying%2f20150806%2fzhuanwaqiangbijili_4778216.jpg.285.jpg&ehk=eC86D3s1e4EmLx1yu%2ftXWPRPUjllh3%2f%2bWTo6LWUPKJw%3d&risl=&pid=ImgRaw&r=0',
    'https://ts1.cn.mm.bing.net/th/id/R-C.2872f6260ee4f62997ff71253219d372?rik=21%2b5AFSpiNUTOQ&riu=http%3a%2f%2fimg.redocn.com%2fsheying%2f20161103%2fshuiche_7394287_small.jpg&ehk=Xcl0tCeg9aVQzEZcDD0NdLYU1hbypWPJ84PbSLh0zIE%3d&risl=&pid=ImgRaw&r=0'
  ])
</script>
