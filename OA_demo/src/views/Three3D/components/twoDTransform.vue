<template>
  <div style="position: relative; height: 100%">
    <div
      ref="threeRef"
      style="position: absolute; height: 100%; width: 100%"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    ></div>
    <span style="position: absolute; right: 0" class="margin">
      <el-button type="success" @click="updateImages">退出</el-button>
    </span>
    <span class="margin-left-xl arrowLeft" @click="ArrowLeft">
      <el-icon size="50px"><ArrowLeftBold /></el-icon>
    </span>
    <span class="margin-right-xl arrowRight" @click="ArrowRight">
      <el-icon size="50px"><ArrowRightBold /></el-icon>
    </span>
  </div>
</template>

<script setup>
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import TWEEN from 'three/examples/jsm/libs/tween.module.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js'
// import { Water } from 'three/examples/jsm/objects/Water.js'
import { onMounted, ref, onUnmounted, inject, getCurrentInstance } from 'vue'

const cxt = getCurrentInstance()
const bus = cxt.appContext.config.globalProperties.$bus
const threeRef = ref(null)
let loading = ref(false)
let width = 400
let height = window.innerHeight - 60
let scene, req, renderer, camera, Controls, Loader
const circle = ref()
const fov = 75
const isMouseMove = ref(true)
let currentLookAt = new THREE.Vector3(0, 0, 0)
const isHome = inject('isHome')
onMounted(() => {
  detail.value = totalData.value[dataIndex.value]
  let xnbdvj = threeRef.value.getBoundingClientRect()
  width = xnbdvj.width
  init()
  window.addEventListener('resize', onresize)
  onresize()
  // window.addEventListener('mousedown', MouseMoveTrue)
  // window.addEventListener('mousemove', MouseMoveFalse)
})
onUnmounted(() => {
  cancelAnimationFrame(req)
  window.removeEventListener('resize', onresize)
  // window.removeEventListener('mousedown', MouseMoveTrue)
  // window.removeEventListener('mousemove', MouseMoveFalse)
})

const handleClick = (event) => {
  if (isMouseMove.value) {
    watchClick(event)
  }
}
const init = () => {
  // 创建3D场景对象Scene
  scene = new THREE.Scene()
  //初始化相机
  camera = new THREE.PerspectiveCamera(fov, width / height, 0.1, 2000)
  //设置相机所在的位置
  camera.position.set(150, 30, 0)
  camera.lookAt(currentLookAt)
  //渲染器
  renderer = new THREE.WebGLRenderer({
    antialias: true //设置抗锯齿
  })
  //定义渲染器的尺寸
  renderer.setSize(width, height)
  threeRef.value.appendChild(renderer.domElement)
  //添加轨道控制器
  Controls = new OrbitControls(camera, renderer.domElement)
  Controls.enableDamping = true
  Controls.maxPolarAngle = Math.PI * 0.5
  Controls.update()
  // initLightAxes()
  initLoader()
  // createCircle()
  createSkySphere()
}
//动画刷新
let clock = new THREE.Clock()
const initAnimate = () => {
  //   let t = clock.getElapsedTime() % 20
  //   t = t / 20
  renderer.clear()
  req = requestAnimationFrame(initAnimate)
  const delta = clock.getDelta()
  // 更新所有混合器
  mixers.forEach((mixer) => {
    mixer.update(delta)
  })
  TWEEN.update() //更新tween
  // 更新精灵位置，使其在屏幕上的位置不变
  updateSpritePosition(width / 0.8, height / 2)
  renderer.render(scene, camera) //渲染操作
  // planeFly(camera, circle.value, t)
}
//监听画布的全屏事件
const onresize = () => {
  let xnbdvj = threeRef.value.getBoundingClientRect()
  width = xnbdvj.width
  height = xnbdvj.height
  window.onresize = function () {
    renderer.setSize(xnbdvj.width, xnbdvj.height)
    camera.aspect = xnbdvj.width / xnbdvj.height
    camera.updateProjectionMatrix()
  }
}

//
const MouseMoveTrue = () => {
  isMouseMove.value = true
}
const MouseMoveFalse = () => {
  isMouseMove.value = false
}
//初始化加载器
const machineData = ref([
  { name: '1号', isRun: true, position: { x: 20, y: 8, z: 0 } },
  { name: '2号', isRun: false, position: { x: 20, y: 8, z: 50 } },
  { name: '3号', isRun: true, position: { x: 20, y: 8, z: 100 } },
  { name: '4号', isRun: true, position: { x: 20, y: 8, z: -50 } },
  { name: '5号', isRun: false, position: { x: 20, y: 8, z: -100 } },
  { name: '6号', isRun: true, position: { x: 20, y: 8, z: -150 } }
  // { name: '7号', isRun: false, position: { x: -20, y: 8, z: -70 } },
  // { name: '8号', isRun: false, position: { x: -20, y: 8, z: -105 } },
  // { name: '9号', isRun: true, position: { x: -20, y: 8, z: -140 } }
])
const initLoader = () => {
  //添加机器人
  //设置解压缩的加载器
  loading.value = true
  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath('../draco/')
  dracoLoader.setDecoderConfig({ type: 'js' })

  // 创建一个加载管理器
  const loadingManager = new THREE.LoadingManager()
  loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {
    console.log(`Started loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files.`)
  }

  loadingManager.onLoad = () => {
    console.log('Loading complete!')
  }

  loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
    const progress = (itemsLoaded / itemsTotal) * 100
    console.log(
      `Loading file: ${url}. Loaded ${itemsLoaded} of ${itemsTotal} files. Progress: ${progress.toFixed(2)}%`
    )
  }

  loadingManager.onError = (url) => {
    console.log(`There was an error loading ${url}`)
  }
  Loader = new GLTFLoader(loadingManager)
  Loader.setDRACOLoader(dracoLoader)
  Loader.load('../model/equipment.glb', function (gltf) {
    gltf.scene.position.set(0, -1, 0)
    gltf.scene.rotateY(Math.PI / 2)
    gltf.scene.scale.set(10, 10, 10)
    translateCamera({}, gltf.scene.position)
    scene.remove(sprite)
    new SpriteText(
      gltf.scene.name,
      new THREE.Vector3(gltf.scene.position.x, gltf.scene.position.y, gltf.scene.position.z + 25),
      '#00ff00',
      '#fff'
    )
    loading.value = false
    group.add(gltf.scene)
    scene.add(group)
    // 创建克隆模型的动画混合器
    const clonedMixer = new THREE.AnimationMixer(gltf.scene)
    mixers.push(clonedMixer)
    // 获取动画混合器
    gltf.animations.forEach((clip) => {
      // 设置动画速度  timeScale
      clonedMixer.timeScale = 0.5 //timeScale = 0.5时，该动画10s一个来回
      // 暂停动画 paused = true或者timeScale = 0;
      // clonedMixer.paused = true
      // 恢复动画paused = false 或者使用 timeScale > 0(timeScale设置为自己觉得动画合适的值即可)
      // clonedMixer.paused = false;

      clonedMixer.clipAction(clip).play()
    })
    initAnimate()
  })
  Loader.load('../model/gc001.glb', function (gltf) {
    gltf.scene.position.set(0, -23, 0)
    gltf.scene.scale.set(2, 1, 2)
    scene.add(gltf.scene)
    camera.updateProjectionMatrix()
    loading.value = false
  })
}

let group = new THREE.Group()
// 创建一个动画混合器数组来存储多个混合器
const mixers = []
const cloneModel = (model, modelParent) => {
  machineData.value.forEach((item) => {
    let apps = model.clone(true)
    apps.position.x = item.position.x
    apps.position.z = item.position.z
    apps.name = item.name
    scene.remove(sprite)
    if (item.isRun) {
      new SpriteText(
        apps.name,
        new THREE.Vector3(apps.position.x, apps.position.y + 25, apps.position.z + 5),
        '#00ff00',
        '#FFFFFF'
      )
      // 克隆模型的骨骼
      const cloneSkeleton = (source, target) => {
        if (source.isSkinnedMesh && target.isSkinnedMesh) {
          target.skeleton = source.skeleton.clone()
        }
        for (let i = 0; i < source.children.length; i++) {
          cloneSkeleton(source.children[i], target.children[i])
        }
      }
      cloneSkeleton(model, apps)
      // 创建克隆模型的动画混合器
      const clonedMixer = new THREE.AnimationMixer(apps)
      mixers.push(clonedMixer)
      // 获取动画混合器
      modelParent.animations.forEach((clip) => {
        clonedMixer.clipAction(clip).play()
      })
    } else {
      new SpriteText(
        apps.name,
        new THREE.Vector3(apps.position.x, apps.position.y + 25, apps.position.z + 5),
        '#ff0000',
        '#FFFFFF'
      )
    }

    group.add(apps)
  })
  scene.add(group)
}

let sprite
//创建精灵文字
class SpriteText {
  constructor(text, position, color1, color2) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')

    canvas.width = 400
    canvas.height = 300
    // context.clearRect(0, 0, 400, 300)
    context.beginPath()
    context.moveTo(50, 50)
    context.lineTo(400, 50)
    context.lineTo(400, 300)
    context.lineTo(50, 300)
    context.lineTo(50, 100)
    context.lineTo(0, 150)
    context.lineTo(50, 80)
    context.lineTo(50, 50)
    context.fillStyle = 'rgba(9,48,101,0.4)'

    context.fill()
    context.stroke()
    context.fillStyle = color2
    context.font = '20px 宋体'
    let x = 60
    let y = 80
    detail.value.forEach((el) => {
      // 格式化文本
      let nameText = `${el.label}: ${el.value}`
      // 在画布上绘制文本
      context.fillText(nameText, x, y)
      y += 30
    })
    context.closePath()

    let texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.SpriteMaterial({
      map: texture,
      transparent: true
    })
    sprite = new THREE.Sprite(material)
    // sprite.scale.set(10, 10, 1)
    // sprite.position.copy(position)
    scene.add(sprite)
  }
}
const updateSpritePosition = (x, y) => {
  // 将2D屏幕坐标转换为3D世界坐标
  const vector = new THREE.Vector3(
    (x / window.innerWidth) * 2 - 1,
    -(y / window.innerHeight) * 2 + 1,
    0.9
  )
  vector.unproject(camera)

  // 设置精灵位置
  sprite.position.copy(vector)
}

const createCircle = () => {
  const curve = new THREE.EllipseCurve(
    0,
    0, // ax, aY
    150,
    250, // xRadius, yRadius
    0,
    2 * Math.PI, // aStartAngle, aEndAngle
    false, // aClockwise
    0 // aRotation
  )

  const curvePoints = curve.getPoints(50)
  curvePoints.forEach((el) => {
    el.z = el.y
    el.y = 60
  })

  circle.value = new THREE.CatmullRomCurve3(curvePoints)
  // const points = circle.getPoints(50)
  // const geometry = new THREE.BufferGeometry().setFromPoints(points)

  // const material = new THREE.LineBasicMaterial({ color: 0xff0000 })

  // // Create the final object to add to the scene
  // const ellipse = new THREE.Line(geometry, material)
  // ellipse.rotateX(Math.PI)
  // ellipse.position.y = 100
  // ellipse.visible = false
  // scene.add(ellipse)
}

const planeFly = (plane, curve, t) => {
  //设置飞机飞行路径
  plane.position.copy(curve.getPoint(t)) //getPointAt()
  //设置飞机飞行方向
  plane.lookAt(0, 0, 0)
}

const watchClick = (event) => {
  // 获取特定区域的DOM元素
  const targetArea = threeRef.value
  if (targetArea == undefined) {
    return
  }
  // 检查点击事件是否发生在特定区域内
  // if (event.target === targetArea || targetArea.contains(event.target)) {
  // 处理在特定区域内的点击事件
  const px = event.offsetX
  const py = event.offsetY
  const x = (px / width) * 2 - 1
  const y = -(py / height) * 2 + 1
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera)
  const intersects = raycaster.intersectObjects([group])

  if (intersects.length > 0) {
    // 获取选中模型的数据
    const selectedObject = intersects[0].object

    // 遍历父级链以找到Group
    selectedObject.traverseAncestors((ancestor) => {
      if (ancestor.isGroup && ancestor.name) {
        // 相机移动函数
        translateCamera({ x: 40, z: 80 }, ancestor.position)
      }
    })
  }
}

// 定义相机移动函数  (基于gsap的补间动画)
const translateCamera = (position, target) => {
  const tweenCamera = new TWEEN.Tween(camera.position)
  tweenCamera.to({ x: target.x + 60, y: target.y, z: target.z }, 500).start()
  const tweenLookAt = new TWEEN.Tween(currentLookAt)
  tweenLookAt
    .to(target, 500)
    .onUpdate((obj) => {
      Controls.target.set(obj.x, obj.y, obj.z) //坐标原点
      camera.lookAt(obj.x, obj.y, obj.z)
    })
    .start()
  //禁用控制器的缩放功能
  Controls.enableZoom = false
}

let sun
//创建天空
const createSkySphere = () => {
  sun = new THREE.Vector3()
  const sky = new Sky()
  sky.scale.setScalar(10000)
  scene.add(sky)

  const skyUniforms = sky.material.uniforms

  skyUniforms['turbidity'].value = 10
  skyUniforms['rayleigh'].value = 2
  skyUniforms['mieCoefficient'].value = 0.005
  skyUniforms['mieDirectionalG'].value = 0.8

  const parameters = {
    elevation: 5,
    azimuth: 180
  }

  const pmremGenerator = new THREE.PMREMGenerator(renderer)
  const sceneEnv = new THREE.Scene()

  let renderTarget

  function updateSun() {
    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation)
    const theta = THREE.MathUtils.degToRad(parameters.azimuth)

    sun.setFromSphericalCoords(1, phi, theta)

    sky.material.uniforms['sunPosition'].value.copy(sun)
    // water.material.uniforms['sunDirection'].value.copy(sun).normalize()

    if (renderTarget !== undefined) renderTarget.dispose()

    sceneEnv.add(sky)
    renderTarget = pmremGenerator.fromScene(sceneEnv)
    scene.add(sky)

    scene.environment = renderTarget.texture
  }

  updateSun()
}

const updateImages = () => {
  isHome.value = true
}

const totalData = ref([
  [
    { label: '机台名称', value: '1号机' },
    { label: '机台状态', value: '停机' },
    { label: '停机时间', value: '2012-12-02 10:54:08' },
    { label: '停机原因', value: '线路毁坏' },
    { label: '停机时长', value: '22小时45分钟' }
  ],
  [
    { label: '机台名称', value: '4号机' },
    { label: '机台状态', value: '停机' },
    { label: '停机时间', value: '2015-12-02 11:24:08' },
    { label: '停机原因', value: '停电' },
    { label: '停机时长', value: '55小时45分钟' }
  ],
  [
    { label: '机台名称', value: '9号机' },
    { label: '机台状态', value: '停机' },
    { label: '停机时间', value: '2019-01-21 23:11:28' },
    { label: '停机原因', value: '未知' },
    { label: '停机时长', value: '3小时118分钟' }
  ]
])
const dataIndex = ref(0)
const detail = ref([])
const ArrowLeft = () => {
  console.log('11111111111111111111')
  dataIndex.value--
  if (dataIndex.value < 0) {
    dataIndex.value = totalData.value.length - 1
  }
  detail.value = totalData.value[dataIndex.value]
  scene.remove(sprite)
  new SpriteText('', '', '#00ff00', '#fff')
}

const ArrowRight = () => {
  console.log('2222222222222222222222222')
  dataIndex.value++
  if (dataIndex.value > totalData.value.length - 1) {
    dataIndex.value = 0
  }
  detail.value = totalData.value[dataIndex.value]
  scene.remove(sprite)
  new SpriteText('', '', '#00ff00', '#fff')
}
</script>

<style scoped>
.arrowLeft {
  position: absolute;
  left: 0;
  top: 50%;
  color: #fff;
}
.arrowRight {
  position: absolute;
  right: 0;
  top: 50%;
  color: #fff;
}
</style>
