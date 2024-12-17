const { error } = require("console");
const {
  readFileSync,
  existsSync,
  rmdirSync,
  mkdirSync,
  writeFileSync,
} = require("fs");
const { resolve } = require("path");
const tagList = JSON.parse(
  readFileSync(resolve(__dirname, "data/tag.json"), "utf-8")
);
const eventList = JSON.parse(
  readFileSync(resolve(__dirname, "data/event.json"), "utf-8")
);
const typeList = JSON.parse(
  readFileSync(resolve(__dirname, "data/type.json"), "utf-8")
);

module.exports = function (filename, fileJSON) {
  //编译fileJSON
  //创建文件夹
  //创建文件
  const data = {
    state: {},
    props: {},
    computed: {},
    handlers: {},
  };

  const template = compileTemplte(fileJSON, data);
  const { script, handler, states } = compileScript(data);

  const exist = existsSync(resolve(__dirname, `output/${filename}`));
  if (exist) {
    rmdirSync(resolve(__dirname, `output/${filename}`), {
      recursive: true,
      force: true,
    });
  }

  mkdirSync(resolve(__dirname, `output/${filename}`));

  writeFileSync(
    resolve(__dirname, `output/${filename}/index.vue`),
    createVueComponent(template, script)
  );

  writeFileSync(resolve(__dirname, `output/${filename}/handler.js`), handler);

  writeFileSync(
    resolve(__dirname, `output/${filename}/states.js`),
    `import { ref } from 'vue'\n${states}`
  );

  console.log(script, "\n", handler, "\n", states);
};

function createVueComponent(template, script) {
  return `<template>\n${template}\n</template>\n<script setup>\n${script}\n</script>`;
}

function compileTemplte(json, data) {
  const { tag, children, classes, states, props, computed, events, text } =
    json;
  if (!tagList.includes(tag)) {
    throw error("标签不合法");
  }
  let html = `<${tag} `;
  if (classes) {
    html += `class="${classes.join(" ")}"`;
  }

  if (events) {
    for (let k in events) {
      if (!eventList.includes(k)) {
        return new error("事件名称不存在");
      }
      html += `@${k}="${Object.keys(events[k]).join(",")}"`;
      data.handlers = {
        ...data.handlers,
        ...events[k],
      };
    }
  }

  html = html.trim() + ">";

  if (states) {
    html += `{{ ${Object.keys(states).join("+")} }}`;
    data.state = {
      ...data.state,
      ...states,
    };
  }

  if (props) {
    for (let k in props) {
      if (!typeList.includes(props[k])) {
        return new Error("属性类型不存在");
      }
    }

    html += `{{ ${Object.keys(props).join("+")} }}`;

    data.props = {
      ...data.props,
      ...props,
    };
  }

  if (computed) {
    html += `{{ ${Object.keys(computed).join("+")} }}`;

    data.computed = {
      ...data.computed,
      ...computed,
    };
  }

  if (text) {
    html += `${text}`;
  }

  if (children) {
    children.forEach((sbuHTML) => {
      html += compileTemplte(sbuHTML, data);
    });
  }

  html += `</${tag}>`;

  return html;
}

function compileScript(data) {
  const { state, props, computed, handlers } = data;
  const vueDeps = [];
  let script = "";
  let handler = "";
  let states = "";
  let handlerBody = [];
  if (Object.keys(computed).length) {
    vueDeps.push("computed");
  }

  script += `import { ${vueDeps.join(",")} } from 'vue'\n`;

  for (let h in handlers) {
    const reg = /\((.*?)\)/;
    const matched = h.match(reg);
    let hName = h;
    if (matched) {
      hName = h.replace(reg, "").trim();
      script += `import { ${hName} } from './handler.js'\n`;
      handler += `export const ${hName} = (${matched[1]}) => {\n ${handlers[h]} \n}\n`;
    } else {
      script += `import { ${hName} } from './handler.js'\n`;
      handler += `export const ${hName} = () => {\n ${handlers[h]} \n}\n`;
    }
    handlerBody.push(handlers[h]);
  }

  for (let s in state) {
    states += `export const ${s} = ref(${state[s]})\n`;
    script += `import { ${s} } from './states'\n`;

    for (let body of handlerBody) {
      if (body.includes(s)) {
        const impt = `import { ${s} } from './states'\n`;
        if (!handler.includes(impt)) {
          handler = impt + handler;
        }
      }
    }
  }
  script += `const props = defineProps({\n`;
  let scriptProps = "";
  for (let p in props) {
    scriptProps += `${p}:${props[p]},\n`;
  }
  script += `${scriptProps}})\n`;

  for (let c in computed) {
    script += `const ${c} = computed(()=> ${computed[c]} )\n`;
  }
  return {
    script,
    handler,
    states,
  };
}
