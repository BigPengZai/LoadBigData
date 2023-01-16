const getList = () => {
  return new Promise((resolve, reject) => {
    let list = [];
    let num = 0;
    for (i = 0; i < 100000; i++) {
      num++;
      list.push({
        imgUrl:
          "https://p3-passport.byteimg.com/img/user-avatar/c2b1804b60fb058877c763a19ca3297d~100x100.awebp",
        title: `第${num}条`,
        tid: num,
      });
    }
    resolve(list);
  });
};

const container = document.getElementById("container");
// 1.直接怼  15s左右
// const renderList = async () => {
//   //   console.time("列表时间");
//   // 记录任务开始时间
//   let now = Date.now();

//   const list = await getList();
//   list.forEach((item) => {
//     const div = document.createElement("div");
//     div.className = "sunshine";
//     div.innerHTML = `<img src="${item.imgUrl}"/> <span>${item.title}</span>`;
//     container.appendChild(div);
//   });
//   //   console.timeEnd("列表时间");
//   console.log("JS运行时间：", Date.now() - now);
//   setTimeout(() => {
//     console.log("总运行时间：", Date.now() - now);
//   }, 0);
// };
// renderList();

// 2.分页  + setTimeout   336ms
// const renderList = async () => {
//   const now = Date.now();
//   const list = await getList();
//   let total = list.length;
//   let page = 0;
//   let limit = 200;

//   const totalPage = Math.ceil(total / limit);
//   const render = (page) => {
//     if (page >= totalPage) return;
//     setTimeout(() => {
//       for (let i = page * limit; i < page * limit + limit; i++) {
//         const item = list[i];
//         const div = document.createElement("div");
//         div.className = "sunshine";
//         div.innerHTML = `<img src="${item.imgUrl}" /><span>${item.title}</span>`;
//         container.appendChild(div);
//       }
//       render(page + 1);
//     }, 0);
//   };
//   render(page);
//   console.log("JS运行时间：", Date.now() - now);
//   setTimeout(() => {
//     console.log("总运行时间：", Date.now() - now);
//   }, 0);
// };
// renderList();

// 分页 + requestAnimationFrame(减少重排) 233ms
// window.requestAnimationFrame()
// const renderList = async () => {
//   const now = Date.now();
//   const list = await getList();
//   const total = list.length;
//   let page = 0;
//   let limit = 200;

//   let totalPage = Math.ceil(total / limit);
//   const render = (page) => {
//       if (page >= totalPage) return;
//     requestAnimationFrame(() => {

//       for (let i = page * limit; i < page * limit + limit; i++) {
//         const item = list[i];
//         const div = document.createElement("div");
//         div.className = "sunshine";
//         div.innerHTML = `<img src="${item.imgUrl}" /><span>${item.title}</span>`;
//         container.appendChild(div);
//       }
//       render(page + 1);
//     });
//   };
//   render(page);
//   console.log("JS运行时间：", Date.now() - now);
//   setTimeout(() => {
//     console.log("总运行时间：", Date.now() - now);
//   }, 0);
// };
// renderList();

// 3.分页 + requestAnimationFrame（减少重排）  + createDocumentFragment（减少文档碎片）
// 200ms
const renderList = async () => {
  const now = Date.now();
  const list = await getList();
  const total = list.length;
  let page = 0;
  let limit = 200;

  let totalPage = Math.ceil(total / limit);

  const render = (page) => {
    if (page >= totalPage) return;
    requestAnimationFrame(() => {
      const fragment = document.createDocumentFragment();
      for (let i = page * limit; i < page * limit + limit; i++) {
        const item = list[i];
        const div = document.createElement("div");
        div.className = "sunshine";
        div.innerHTML = `<img src="${item.imgUrl}" /><span>${item.title}</span>`;
        fragment.appendChild(div);
      }
      // 一次性加入div
      container.appendChild(fragment);
      render(page + 1);
    });
  };
  render(page);
  console.log("JS运行时间：", Date.now() - now);
  setTimeout(() => {
    console.log("总运行时间：", Date.now() - now);
  }, 0);
};
renderList();

// 懒加载

// 虚拟列表
