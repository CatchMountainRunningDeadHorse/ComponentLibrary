// worker.js

// Set up a simple message listener
self.onmessage = function (event) {
    console.log('华氏度VS大V比',event,JSON.parse(event.data));
    // 加载模型
    const model = JSON.parse(event.data)
    model.traverse((child) => {
        if (child.name === "Plane") {
            child.visible = false;
        }
        if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
    self.postMessage(JSON.stringify(model))
};