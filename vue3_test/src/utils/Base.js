import * as THREE from 'three'
export default class Base{

    constructor(document){
        //创建场景
        this.scene = new THREE.Scene()
        //创建透视相机
        this.camera = new THREE.PerspectiveCamera(
            75,
            (window.innerWidth - 200)/(window.innerHeight - 60),
            0.1,
            1000
        )
        //创建渲染器
        this.renderer = new THREE.WebGLRenderer({antialias:true})
        this.renderer.setSize(window.innerWidth - 200,window.innerHeight - 60)
        this.renderer.setPixelRatio(window.devicePixelRatio)
        document.appendChild(this.renderer.domElement)
    }

    update(){
        this.renderer.render(this.scene,this.camera)
    }

    resize(){
        this.camera.aspect = (window.innerWidth - 200)/(window.innerHeight - 60)
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth - 200,window.innerHeight - 60)
    }

    addAmbientLight(intensity=1,color=0xffffff){
        const light = new THREE.AmbientLight(color,intensity)
        this.scene.add(light)
    }
}